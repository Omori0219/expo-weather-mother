import { useCallback } from 'react';
import { useUser } from './useUser';
import { useWeather } from './useWeather';

export function useWeatherManager() {
  const { userData, saveUserData, fetchUserData } = useUser();
  const { weatherData, fetchWeather, isLoading: isWeatherLoading, error } = useWeather();

  // 地域コードを更新し、その地域の天気データを取得
  const updateAreaAndWeather = useCallback(
    async (areaCode: string) => {
      try {
        // 地域コードを保存
        const success = await saveUserData(areaCode);
        if (!success) {
          throw new Error('地域の保存に失敗しました');
        }

        // ユーザーデータを再取得
        await fetchUserData();

        // 新しい地域の天気を取得
        await fetchWeather(areaCode);

        return true;
      } catch (error) {
        console.error('地域と天気の更新に失敗しました:', error);
        return false;
      }
    },
    [saveUserData, fetchUserData, fetchWeather]
  );

  // 現在の地域の天気を更新
  const refreshCurrentWeather = useCallback(async () => {
    if (!userData?.areaCode) return false;

    try {
      await fetchUserData();
      await fetchWeather(userData.areaCode);
      return true;
    } catch (error) {
      console.error('天気の更新に失敗しました:', error);
      return false;
    }
  }, [userData?.areaCode, fetchUserData, fetchWeather]);

  return {
    userData,
    weatherData,
    isWeatherLoading,
    error,
    updateAreaAndWeather,
    refreshCurrentWeather,
  };
}
