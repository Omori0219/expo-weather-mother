import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import type { WeatherData } from '../types/weather';
import { AREAS } from '../constants/areas';

interface WeatherInfoProps {
  weatherData: WeatherData | null;
  areaCode: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function WeatherInfo({
  weatherData,
  areaCode,
  onRefresh,
  isRefreshing = false,
}: WeatherInfoProps) {
  if (!weatherData) return null;

  const area = AREAS.find(a => a.areaCode === areaCode);
  const formattedDate = new Date(
    weatherData.date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
  ).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={['#007AFF']}
          tintColor="#007AFF"
          title="天気情報を更新中..."
          titleColor="#666"
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.areaName}>{area?.areaName || '不明な地域'}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      <View style={styles.messageContainer}>
        <Text style={styles.message}>{weatherData.message}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  areaName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  messageContainer: {
    padding: 16,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
