import { StyleSheet, View, Platform, ViewStyle, TextStyle } from 'react-native';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ErrorMessage } from '../components/ErrorMessage';
import { useState, useEffect, useCallback } from 'react';
import { AREAS } from '../constants/areas';
import { useIsFocused } from '@react-navigation/native';
import { useWeatherManager } from '../hooks/useWeatherManager';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Background } from '../components/weather/Background';
import { DateDisplay } from '../components/weather/DateDisplay';
import { AreaDisplay } from '../components/weather/AreaDisplay';
import { WeatherMessage } from '../components/weather/WeatherMessage';
import { MotherCharacter } from '../components/weather/MotherCharacter';

type WeatherScreenStyles = {
  container: ViewStyle;
  content: ViewStyle;
  header: ViewStyle;
  weatherMessageContainer: ViewStyle;
  // footer: ViewStyle;
  motherCharacterContainer: ViewStyle;
};

export function WeatherScreen() {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { userData, weatherData, isWeatherLoading, error, refreshCurrentWeather } =
    useWeatherManager();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 初期データ読み込み
  useEffect(() => {
    const loadInitialData = async () => {
      if (!isInitialLoading) return;

      try {
        await refreshCurrentWeather();
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, [isInitialLoading, refreshCurrentWeather]);

  // 画面フォーカス時の更新
  useEffect(() => {
    if (!isFocused || isInitialLoading) return;
    refreshCurrentWeather();
  }, [isFocused, isInitialLoading, refreshCurrentWeather]);

  const isLoading = isInitialLoading || isWeatherLoading;
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

const styles = StyleSheet.create<WeatherScreenStyles>({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 0,
    // backgroundColor: 'blue',
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
