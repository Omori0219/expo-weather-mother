import { useCallback, useState } from 'react';
import { useUser } from './useUser';
import { useWeather } from './useWeather';
import type { WeatherData } from '../types/weather';
import { WeatherTransformer } from '../services/weather';

interface WeatherState {
  data: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface RefreshOptions {
  silent?: boolean;
}

export function useWeatherManager() {
  const { userData, saveUserData, fetchUserData } = useUser();
  const { weatherData: latestWeatherData, fetchWeather } = useWeather();

  // 状態を一元管理
  const [state, setState] = useState<WeatherState>({
    data: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  // 天気データの更新
  const refreshCurrentWeather = useCallback(
    async ({ silent = false }: RefreshOptions = {}) => {
      if (!userData?.areaCode) return false;

      // サイレントモードでない場合のみローディング状態を更新
      if (!silent) {
        setState(prev => ({ ...prev, isLoading: true }));
      }

      try {
        // まずキャッシュデータを使用
        if (state.data) {
          setState(prev => ({
            ...prev,
            data: prev.data,
            isLoading: false,
          }));
        }

        // バックグラウンドで最新データを取得
        await fetchUserData();
        const weatherDoc = await fetchWeather(userData.areaCode);

        if (weatherDoc) {
          // WeatherDocumentからWeatherDataへ変換
          const newData: WeatherData = {
            message: WeatherTransformer.parseGeneratedMessage(weatherDoc.generatedMessage)
              .mother_message,
            date: WeatherTransformer.formatDate(weatherDoc.createdAt),
            areaName: WeatherTransformer.getAreaName(weatherDoc.areaCode),
            createdAt: weatherDoc.createdAt,
          };

          // 新しいデータがある場合のみ更新
          if (JSON.stringify(newData) !== JSON.stringify(state.data)) {
            setState(prev => ({
              ...prev,
              data: newData,
              lastUpdated: new Date(),
              error: null,
              isLoading: false,
            }));
          } else {
            setState(prev => ({
              ...prev,
              isLoading: false,
            }));
          }
        }

        return true;
      } catch (error) {
        // エラー時もキャッシュデータを維持
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : '天気情報の取得に失敗しました',
          isLoading: false,
        }));
        return false;
      }
    },
    [userData?.areaCode, fetchUserData, fetchWeather, state.data]
  );

  // 地域コードを更新し、その地域の天気データを取得
  const updateAreaAndWeather = useCallback(
    async (areaCode: string) => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));

        // 地域コードを保存
        const success = await saveUserData(areaCode);
        if (!success) {
          throw new Error('地域の保存に失敗しました');
        }

        // ユーザーデータを再取得
        await fetchUserData();

        // 新しい地域の天気を取得
        const weatherDoc = await fetchWeather(areaCode);

        if (weatherDoc) {
          // WeatherDocumentからWeatherDataへ変換
          const newData: WeatherData = {
            message: WeatherTransformer.parseGeneratedMessage(weatherDoc.generatedMessage)
              .mother_message,
            date: WeatherTransformer.formatDate(weatherDoc.createdAt),
            areaName: WeatherTransformer.getAreaName(weatherDoc.areaCode),
            createdAt: weatherDoc.createdAt,
          };

          setState(prev => ({
            ...prev,
            data: newData,
            lastUpdated: new Date(),
            error: null,
            isLoading: false,
          }));
        }

        return true;
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : '地域と天気の更新に失敗しました',
          isLoading: false,
        }));
        return false;
      }
    },
    [saveUserData, fetchUserData, fetchWeather]
  );

  return {
    userData,
    weatherData: state.data,
    isWeatherLoading: state.isLoading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    updateAreaAndWeather,
    refreshCurrentWeather,
  };
}
