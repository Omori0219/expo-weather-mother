import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import type { WeatherDisplayData } from '../types/weather';

interface WeatherInfoProps {
  weatherDisplayData: WeatherDisplayData | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function WeatherInfo({
  weatherDisplayData,
  onRefresh,
  isRefreshing = false,
}: WeatherInfoProps) {
  if (!weatherDisplayData) return null;

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
        <Text style={styles.areaName}>{weatherDisplayData.areaName}</Text>
        <Text style={styles.date}>{weatherDisplayData.displayDate}</Text>
      </View>

      <View style={styles.messageContainer}>
        <Text style={styles.message}>{weatherDisplayData.motherMessage}</Text>
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
