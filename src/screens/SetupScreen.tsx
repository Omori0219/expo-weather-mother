import { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  ViewStyle,
  TextStyle,
  Dimensions,
  Alert,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp, MainDrawerNavigationProp } from '../types/navigation';
import { useWeatherManager } from '../hooks/useWeatherManager';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../hooks/useAuth';
import { updateNotificationSettings } from '../services/notification';
import { PREFECTURE_LIST } from '../constants/prefectures';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ERROR_DOMAINS, createError, handleError } from '../lib/error/handler';

type SetupScreenProps = {
  isInitialSetup?: boolean;
};

type SetupScreenStyles = {
  container: ViewStyle;
  loadingContainer: ViewStyle;
  title: TextStyle;
  scrollView: ViewStyle;
  prefecturesContainer: ViewStyle;
  prefectureButton: ViewStyle;
  selectedButton: ViewStyle;
  prefectureText: TextStyle;
  selectedButtonText: TextStyle;
  error: TextStyle;
  confirmButton: ViewStyle;
  confirmButtonDisabled: ViewStyle;
  confirmButtonText: TextStyle;
  confirmButtonTextDisabled: TextStyle;
  bottomContainer: ViewStyle;
  notificationContainer: ViewStyle;
  description: TextStyle;
  benefit: TextStyle;
};

export function SetupScreen({ isInitialSetup = false }: SetupScreenProps) {
  const stackNavigation = useNavigation<RootStackNavigationProp>();
  const drawerNavigation = useNavigation<MainDrawerNavigationProp>();
  const insets = useSafeAreaInsets();
  const { updateAreaAndWeather, isWeatherLoading, error: weatherError } = useWeatherManager();
  const { requestPermissions, getExpoPushToken } = useNotification();
  const { user } = useAuth();
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [step, setStep] = useState<'prefecture' | 'notification'>('prefecture');

  // 地域選択の処理
  const handlePrefectureSelect = useCallback((areaCode: string) => {
    setSelectedPrefecture(areaCode);
  }, []);

  // 通知設定の保存
  const saveNotificationSettings = useCallback(
    async (status: string, token?: string) => {
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

  // 通知許可の取得処理
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

      stackNavigation.replace('Main');
    } catch (error) {
      const message = handleError(error, ERROR_DOMAINS.SETUP);
      Alert.alert('エラー', `通知の設定中にエラーが発生しました: ${message}`, [
        {
          text: 'OK',
          onPress: () => stackNavigation.replace('Main'),
        },
      ]);
    }
  }, [requestPermissions, getExpoPushToken, saveNotificationSettings, stackNavigation]);

  // 確定ボタンの処理
  const handleConfirm = useCallback(async () => {
    if (!selectedPrefecture) return;

    try {
      const success = await updateAreaAndWeather(selectedPrefecture);
      if (success) {
        if (isInitialSetup) {
          setStep('notification');
        } else {
          drawerNavigation.goBack();
        }
      }
    } catch (error) {
      const message = handleError(error, ERROR_DOMAINS.SETUP);
      Alert.alert('エラー', message);
    }
  }, [selectedPrefecture, isInitialSetup, drawerNavigation, updateAreaAndWeather]);

  const containerStyle = {
    ...styles.container,
    paddingTop: Platform.OS === 'android' ? insets.top : 0,
  };

  // ローディング表示
  const renderLoading = () => (
    <SafeAreaView style={containerStyle}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    </SafeAreaView>
  );

  // 通知設定画面
  const renderNotificationStep = () => (
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

  // 地域選択画面
  const renderPrefectureStep = () => (
    <SafeAreaView style={containerStyle}>
      <Text style={styles.title}>
        {isInitialSetup ? 'お住まいの地域を選択してください' : '地域を変更'}
      </Text>
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
          {PREFECTURE_LIST.map(prefecture => (
            <TouchableOpacity
              key={prefecture.areaCode}
              style={[
                styles.prefectureButton,
                selectedPrefecture === prefecture.areaCode && styles.selectedButton,
              ]}
              onPress={() => handlePrefectureSelect(prefecture.areaCode)}
            >
              <Text
                style={[
                  styles.prefectureText,
                  selectedPrefecture === prefecture.areaCode && styles.selectedButtonText,
                ]}
              >
                {prefecture.areaName}
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

  if (isWeatherLoading) {
    return renderLoading();
  }

  if (step === 'notification') {
    return renderNotificationStep();
  }

  return renderPrefectureStep();
}

const styles = StyleSheet.create<SetupScreenStyles>({
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
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  scrollView: {
    flex: 1,
  },
  prefecturesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 8,
  },
  prefectureButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedButton: {
    backgroundColor: '#007AFF',
  },
  prefectureText: {
    fontSize: 14,
    color: '#333',
    ...Platform.select({
      ios: {
        fontWeight: '400',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
  selectedButtonText: {
    color: '#fff',
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  error: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        fontWeight: '400',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  confirmButtonTextDisabled: {
    color: '#999',
  },
  notificationContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 24,
    ...Platform.select({
      ios: {
        fontWeight: '400',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
  benefit: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        fontWeight: '400',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
});
