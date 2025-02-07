import { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Platform, ViewStyle } from 'react-native';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ErrorMessage } from '../components/ErrorMessage';
import { AREAS } from '../constants/areas';
import { useIsFocused } from '@react-navigation/native';
import { useWeatherManager } from '../hooks/useWeatherManager';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Background } from '../components/weather/Background';
import { DateDisplay } from '../components/weather/DateDisplay';
import { AreaDisplay } from '../components/weather/AreaDisplay';
import { WeatherMessage } from '../components/weather/WeatherMessage';
import { MotherCharacter } from '../components/weather/MotherCharacter';
import { preloadWeatherAssets } from '../utils/preloadAssets';

// 天気データの更新間隔（5分 = 300000ミリ秒）
const WEATHER_UPDATE_INTERVAL = 300000;

export function WeatherScreen() {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { userData, weatherData, isWeatherLoading, error, refreshCurrentWeather } =
    useWeatherManager();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);

  // 最後の更新時刻を追跡
  const lastUpdateRef = useRef<number>(0);

  // アセットのプリロード
  useEffect(() => {
    const loadAssets = async () => {
      const success = await preloadWeatherAssets();
      setIsAssetsLoaded(success);
    };

    loadAssets();
  }, []);

  // 初期データ読み込み
  useEffect(() => {
    const loadInitialData = async () => {
      if (!isInitialLoading) return;

      try {
        // 天気データの取得
        await refreshCurrentWeather();
        lastUpdateRef.current = Date.now();
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, [isInitialLoading, refreshCurrentWeather]);

  // 画面フォーカス時の更新（一定時間経過後のみ）
  useEffect(() => {
    const shouldUpdate = () => {
      const now = Date.now();
      return now - lastUpdateRef.current >= WEATHER_UPDATE_INTERVAL;
    };

    const updateIfNeeded = async () => {
      if (isFocused && !isInitialLoading && shouldUpdate()) {
        await refreshCurrentWeather();
        lastUpdateRef.current = Date.now();
      }
    };

    updateIfNeeded();
  }, [isFocused, isInitialLoading, refreshCurrentWeather]);

  // ローディング状態の更新
  const isLoading = isInitialLoading || isWeatherLoading || !isAssetsLoaded;
  const area = userData?.areaCode ? AREAS.find(a => a.areaCode === userData.areaCode) : null;

  if (isLoading) {
    return <LoadingOverlay visible message={`${area?.areaName || ''}の天気情報を取得中...`} />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshCurrentWeather} />;
  }

  if (!weatherData || !userData?.areaCode) {
    return (
      <ErrorMessage message="天気情報を取得できませんでした" onRetry={refreshCurrentWeather} />
    );
  }

  return (
    <View style={styles.container}>
      <Background />
      <View style={[styles.content, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <View style={styles.header}>
          <SafeAreaView />
          <DateDisplay date={weatherData.createdAt.toDate()} />
          <AreaDisplay areaName={weatherData.areaName} />
          <WeatherMessage message={weatherData.message} />
        </View>
        <View style={styles.motherCharacterContainer}>
          <MotherCharacter />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 0,
  },
  header: {
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 20,
  },
  weatherMessageContainer: {},
  motherCharacterContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -100,
  },
});
