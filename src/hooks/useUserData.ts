import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserData } from '../types/user';

const USER_DATA_KEY = '@user_data';

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);

  const loadUserData = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
      console.log('📝 Loading user data:', jsonValue);
      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        setUserData(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('ユーザーデータの読み込みに失敗しました:', error);
      return null;
    }
  }, []);

  const saveUserData = useCallback(
    async (data: Partial<UserData>) => {
      try {
        const currentData = await loadUserData();
        const newData: UserData = {
          ...currentData,
          ...data,
          updatedAt: new Date(),
          createdAt: currentData?.createdAt || new Date(),
        };

        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(newData));
        console.log('📝 Saved user data:', newData);
        setUserData(newData);
        return true;
      } catch (error) {
        console.error('ユーザーデータの保存に失敗しました:', error);
        return false;
      }
    },
    [loadUserData]
  );

  return {
    userData,
    loadUserData,
    saveUserData,
  };
}
