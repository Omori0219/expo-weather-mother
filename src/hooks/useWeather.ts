import { useState, useCallback } from 'react';

export interface WeatherData {
  publishingOffice: string;
  reportDatetime: string;
  targetArea: string;
  headlineText: string;
  text: string;
}

export function useWeather() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const fetchWeather = useCallback(async (areaCode: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // 気象庁APIのエンドポイント
      const response = await fetch(
        `https://www.jma.go.jp/bosai/forecast/data/overview_forecast/${areaCode}.json`
      );

      if (!response.ok) {
        throw new Error('天気情報の取得に失敗しました');
      }

      const data = await response.json();
      setWeatherData(data);
      return data;
    } catch (err) {
      setError('天気情報の取得に失敗しました');
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
