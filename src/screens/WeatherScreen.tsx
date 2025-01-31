import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ErrorMessage } from '../components/ErrorMessage';
import { WeatherInfo } from '../components/WeatherInfo';
import { useState, useEffect, useCallback } from 'react';
import { AREAS } from '../constants/areas';
import { useIsFocused } from '@react-navigation/native';
import { useWeatherManager } from '../hooks/useWeatherManager';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type WeatherScreenStyles = {
  container: ViewStyle;
  scrollViewContent: ViewStyle;
  content: ViewStyle;
  placeholder: TextStyle;
  subText: TextStyle;
  areaName: TextStyle;
};

export function WeatherScreen() {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
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

  const containerStyle = {
    ...styles.container,
    paddingTop: Platform.OS === 'android' ? insets.top : 0,
  };

  if (!userData?.areaCode) {
    return (
      <SafeAreaView style={containerStyle}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            <Text style={styles.placeholder}>地域が設定されていません</Text>
            <Text style={styles.subText}>設定画面から地域を選択してください</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<WeatherScreenStyles>({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
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
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  subText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontWeight: '400',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
  areaName: {
    fontSize: 18,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        fontWeight: 'bold',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
});
