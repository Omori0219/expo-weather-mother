import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ErrorMessage } from '../components/ErrorMessage';
import { WeatherInfo } from '../components/WeatherInfo';
import { useState, useEffect, useCallback } from 'react';
import { AREAS } from '../constants/areas';
import { useIsFocused } from '@react-navigation/native';
import { useWeatherManager } from '../hooks/useWeatherManager';

export function WeatherScreen() {
  const isFocused = useIsFocused();
  const { userData, weatherData, isWeatherLoading, error, refreshCurrentWeather } =
    useWeatherManager();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 画面初期表示時のデータ読み込み
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsInitialLoading(true);
        await refreshCurrentWeather();
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, [refreshCurrentWeather]);

  // 画面がフォーカスされた時のデータ更新
  useEffect(() => {
    if (isFocused) {
      refreshCurrentWeather();
    }
  }, [isFocused, refreshCurrentWeather]);

  // プルリフレッシュ時の処理
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshCurrentWeather();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshCurrentWeather]);

  const isLoading = isInitialLoading || (isWeatherLoading && !isRefreshing);
  const area = userData?.areaCode ? AREAS.find(a => a.areaCode === userData.areaCode) : null;

  if (!userData?.areaCode) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.placeholder}>地域が設定されていません</Text>
          <Text style={styles.subText}>設定画面から地域を選択してください</Text>
        </View>
      </ScrollView>
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
        <Text style={styles.areaName}>選択中の地域: {area?.areaName || '未設定'}</Text>
        {error ? (
          <ErrorMessage message={error} onRetry={handleRefresh} />
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
