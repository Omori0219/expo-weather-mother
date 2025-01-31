import { StyleSheet, View, Text, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ErrorMessage } from '../components/ErrorMessage';
import { WeatherInfo } from '../components/WeatherInfo';
import { useUserData } from '../hooks/useUserData';
import { useWeather } from '../hooks/useWeather';
import { useState, useEffect, useCallback } from 'react';
import { AREAS } from '../constants/areas';
import { useIsFocused } from '@react-navigation/native';
import { useUser } from '../hooks/useUser';

export function WeatherScreen() {
  const isFocused = useIsFocused();
  const { userData, loadUserData, fetchUserData } = useUser();
  const { isLoading: isWeatherLoading, error, weatherData, fetchWeather } = useWeather();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadWeatherData = useCallback(async () => {
    if (userData?.areaCode) {
      await fetchWeather(userData.areaCode);
    }
  }, [userData?.areaCode, fetchWeather]);

  const loadInitialData = async () => {
    try {
      setIsInitialLoading(true);
      const user = await loadUserData();
      if (user?.areaCode) {
        await fetchWeather(user.areaCode);
      }
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchUserData();
      await loadWeatherData();
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchUserData, loadWeatherData]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchUserData();
    }
  }, [isFocused, fetchUserData]);

  const isLoading = isInitialLoading || (isWeatherLoading && !isRefreshing);
  const area = userData?.areaCode ? AREAS.find(a => a.areaCode === userData.areaCode) : null;

  if (!userData?.areaCode) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.placeholder}>地域が設定されていません</Text>
          <Text style={styles.subText}>設定画面から地域を選択してください</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
    >
      <LoadingOverlay
        visible={isLoading}
        message={`${area?.areaName || ''}の天気情報を取得中...`}
      />
      <View style={styles.content}>
        <Text style={styles.areaName}>選択中の地域: {userData?.areaCode || '未設定'}</Text>
        {error ? (
          <ErrorMessage message={error} onRetry={loadWeatherData} />
        ) : weatherData ? (
          <WeatherInfo
            weatherData={weatherData}
            areaCode={userData.areaCode}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        ) : (
          !isLoading && <Text style={styles.placeholder}>天気情報を取得できませんでした</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  placeholder: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  areaName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
