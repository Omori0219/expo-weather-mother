import { useState, useCallback } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { WeatherDocument, WeatherData } from '../types/weather';

export function useWeather() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const fetchWeather = useCallback(async (areaCode: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // 今日の日付をYYYYMMDD形式で取得
      const today = new Date();
      const dateString = today.toISOString().slice(0, 10).replace(/-/g, '');

      // ドキュメントIDを生成
      const docId = `${dateString}-${areaCode}`;
      console.log('🌤️ Fetching weather data for:', docId);

      // Firestoreからデータを取得
      const docRef = doc(collection(db, 'weather_data'), docId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.log('❌ No weather data found for:', docId);
        throw new Error('本日の天気情報がまだ準備できていません');
      }

      const data = docSnap.data() as WeatherDocument;
      console.log('🌤️ Weather data retrieved:', {
        areaCode: data.areaCode,
        messageLength: data.generatedMessage.length,
        createdAt: data.createdAt,
      });

      setWeatherData({
        message: data.generatedMessage,
        date: dateString,
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '天気情報の取得に失敗しました';
      console.error('❌ Error fetching weather:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    weatherData,
    fetchWeather,
  };
}
