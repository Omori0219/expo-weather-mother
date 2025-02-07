import { useState, useCallback } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { WeatherDocument, WeatherData } from '../types/weather';
import { WeatherTransformer } from '../services/weather';

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

      // Firestoreからデータを取得
      const docRef = doc(collection(db, 'weather_data'), docId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('本日の天気情報がまだ準備できていません');
      }

      const data = docSnap.data() as WeatherDocument;
      const displayData = WeatherTransformer.toDisplayData(data);

      setWeatherData({
        message: WeatherTransformer.parseGeneratedMessage(data.generatedMessage).mother_message,
        date: WeatherTransformer.formatDate(data.createdAt),
        areaName: WeatherTransformer.getAreaName(data.areaCode),
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '天気情報の取得に失敗しました';
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
