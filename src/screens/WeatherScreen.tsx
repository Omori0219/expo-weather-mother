import { StyleSheet, View, Text, SafeAreaView, RefreshControl } from 'react-native';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ErrorMessage } from '../components/ErrorMessage';
import { WeatherInfo } from '../components/WeatherInfo';
import { useUserData } from '../hooks/useUserData';
import { useWeather } from '../hooks/useWeather';
import { useState, useEffect, useCallback } from 'react';

export function WeatherScreen() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { userData, loadUserData } = useUserData();
  const { isLoading: isWeatherLoading, error, weatherData, fetchWeather } = useWeather();

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

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadWeatherData();
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const isLoading = isInitialLoading || (isWeatherLoading && !isRefreshing);

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay visible={isLoading} message="天気情報を取得中..." />
      <View style={styles.content}>
        {error ? (
          <ErrorMessage message={error} onRetry={loadWeatherData} />
        ) : !userData?.areaCode ? (
          <Text style={styles.placeholder}>地域が設定されていません</Text>
        ) : !weatherData ? (
          <Text style={styles.placeholder}>天気情報を取得できませんでした</Text>
        ) : (
          <WeatherInfo weatherData={weatherData} areaCode={userData.areaCode} />
        )}
      </View>
    </SafeAreaView>
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
  },
});
