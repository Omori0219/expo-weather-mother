import { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '../types/navigation';
import { useWeatherManager } from '../hooks/useWeatherManager';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../hooks/useAuth';
import { updateNotificationSettings } from '../services/notification';
import { AREAS } from '../constants/areas';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ERROR_DOMAINS, createError, handleError } from '../lib/error/handler';
import type { NotificationPermissionState } from '../types/notification';

export function SetupScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const insets = useSafeAreaInsets();
  const { updateAreaAndWeather, isWeatherLoading, error: weatherError } = useWeatherManager();
  const { requestPermissions, getExpoPushToken } = useNotification();
  const { user } = useAuth();
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [step, setStep] = useState<'prefecture' | 'notification'>('prefecture');

  const handlePrefectureSelect = useCallback((areaCode: string) => {
    setSelectedPrefecture(areaCode);
  }, []);

  const saveNotificationSettings = useCallback(
    async (status: NotificationPermissionState, token?: string) => {
      if (!user?.uid) return;

      try {
        await updateNotificationSettings(user.uid, {
          isPushNotificationEnabled: status === 'granted',
          permissionState: status,
          ...(token && { expoPushToken: token }),
          lastUpdated: new Date(),
        });
      } catch (error) {
        const message = handleError(error, ERROR_DOMAINS.SETUP);
        throw createError(message, 'settings_save_error', ERROR_DOMAINS.SETUP);
      }
    },
    [user]
  );

  const handleRequestNotificationPermission = useCallback(async () => {
    try {
      const { status } = await requestPermissions();

      if (status === 'granted') {
        try {
          const token = await getExpoPushToken();
          await saveNotificationSettings(status, token);
        } catch (tokenError) {
          console.error('トークン取得エラー:', tokenError);
          await saveNotificationSettings(status);
        }
      } else {
        await saveNotificationSettings(status);
      }

      navigation.replace('Main');
    } catch (error) {
      const message = handleError(error, ERROR_DOMAINS.SETUP);
      Alert.alert('エラー', `通知の設定中にエラーが発生しました: ${message}`, [
        {
          text: 'OK',
          onPress: () => navigation.replace('Main'),
        },
      ]);
    }
  }, [requestPermissions, getExpoPushToken, saveNotificationSettings, navigation]);

  const handleConfirm = useCallback(async () => {
    if (!selectedPrefecture) return;

    try {
      const success = await updateAreaAndWeather(selectedPrefecture);
      if (success) {
        // 初期設定フローなので、必ず通知設定に進む
        setStep('notification');
      }
    } catch (error) {
      const message = handleError(error, ERROR_DOMAINS.SETUP);
      Alert.alert('エラー', message);
    }
  }, [selectedPrefecture, updateAreaAndWeather]);

  const containerStyle = {
    ...styles.container,
    paddingTop: Platform.OS === 'android' ? insets.top : 0,
  };

  if (isWeatherLoading) {
    return (
      <SafeAreaView style={containerStyle}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'notification') {
    return (
      <SafeAreaView style={containerStyle}>
        <View style={styles.notificationContainer}>
          <Text style={styles.title}>通知の設定</Text>
          <Text style={styles.description}>
            毎朝7時に、お母さんからの天気予報メッセージを受け取るには、通知をオンにしてください。
          </Text>
          <Text style={styles.benefit}>通知をオンにすると、雨の日も傘を忘れない！</Text>
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleRequestNotificationPermission}
            >
              <Text style={styles.confirmButtonText}>通知を許可する</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyle}>
      <Text style={styles.title}>お住まいの地域を選択してください</Text>
      {weatherError && <Text style={styles.error}>{weatherError}</Text>}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.prefecturesContainer}>
          {AREAS.map(area => (
            <TouchableOpacity
              key={area.areaCode}
              style={[
                styles.prefectureButton,
                selectedPrefecture === area.areaCode && styles.selectedButton,
              ]}
              onPress={() => handlePrefectureSelect(area.areaCode)}
            >
              <Text
                style={[
                  styles.prefectureText,
                  selectedPrefecture === area.areaCode && styles.selectedButtonText,
                ]}
              >
                {area.areaName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, !selectedPrefecture && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={!selectedPrefecture || isWeatherLoading}
        >
          <Text
            style={[
              styles.confirmButtonText,
              !selectedPrefecture && styles.confirmButtonTextDisabled,
            ]}
          >
            {isWeatherLoading ? '更新中...' : '決定'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
  },
  scrollView: {
    flex: 1,
  },
  prefecturesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  prefectureButton: {
    width: '48%',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#DE0613',
  },
  prefectureText: {
    fontSize: 16,
    color: '#333',
  },
  selectedButtonText: {
    color: '#fff',
  },
  error: {
    color: '#DE0613',
    textAlign: 'center',
    marginBottom: 16,
  },
  notificationContainer: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  benefit: {
    fontSize: 18,
    color: '#DE0613',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: 'bold',
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#DE0613',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButtonTextDisabled: {
    color: '#fff',
  },
});
