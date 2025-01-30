import { StyleSheet, View, Text, ScrollView } from 'react-native';
import type { WeatherData } from '../hooks/useWeather';
import { AREAS } from '../constants/areas';

interface WeatherInfoProps {
  weatherData: WeatherData;
  areaCode: string;
}

export function WeatherInfo({ weatherData, areaCode }: WeatherInfoProps) {
  const area = AREAS.find(a => a.areaCode === areaCode);
  const formattedDate = new Date(weatherData.reportDatetime).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.areaName}>{area?.areaName || '不明な地域'}</Text>
        <Text style={styles.date}>{formattedDate} 発表</Text>
      </View>

      {weatherData.headlineText && (
        <View style={styles.section}>
          <Text style={styles.headline}>{weatherData.headlineText}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>天気概況</Text>
        <Text style={styles.text}>{weatherData.text}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.source}>{weatherData.publishingOffice}</Text>
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
    borderRadius: 8,
    marginBottom: 16,
  },
  areaName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  footer: {
    padding: 16,
  },
  source: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
});
