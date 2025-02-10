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
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWeatherManager } from '../hooks/useWeatherManager';
import { AREAS } from '../constants/areas';
import { ERROR_DOMAINS, handleError } from '../lib/error/handler';
import type { MainTabNavigationProp } from '../types/navigation';

export function AreaSelectionScreen() {
  const navigation = useNavigation<MainTabNavigationProp>();
  const insets = useSafeAreaInsets();
  const {
    updateAreaAndWeather,
    isWeatherLoading,
    error: weatherError,
    userData,
  } = useWeatherManager();
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(
    userData?.areaCode || null
  );

  const handlePrefectureSelect = useCallback((areaCode: string) => {
    setSelectedPrefecture(areaCode);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!selectedPrefecture) return;

    try {
      const success = await updateAreaAndWeather(selectedPrefecture);
      if (success) {
        navigation.goBack();
      } else {
        Alert.alert('エラー', '地域と天気情報の更新に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      const message = handleError(error, ERROR_DOMAINS.SETUP);
      Alert.alert('エラー', message);
    }
  }, [selectedPrefecture, navigation, updateAreaAndWeather]);

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

  return (
    <SafeAreaView style={containerStyle}>
      <Text style={styles.title}>地域を変更</Text>
      {userData?.areaCode && (
        <Text style={styles.currentArea}>
          現在の地域：{AREAS.find(a => a.areaCode === userData.areaCode)?.areaName}
        </Text>
      )}
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
  currentArea: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
});
