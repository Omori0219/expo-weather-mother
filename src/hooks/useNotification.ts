import { useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useAuth } from './useAuth';
import { saveExpoPushToken, updateNotificationSettings } from '../services/notification';
import { NotificationError, NotificationPermissionStatus } from '../types/notification';

// 通知の設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotification() {
  const { user } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [error, setError] = useState<NotificationError | null>(null);

  // 通知権限の取得
  const requestPermissions = useCallback(async (): Promise<NotificationPermissionStatus> => {
    if (!Device.isDevice) {
      throw new Error('実機以外での通知機能はサポートされていません');
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // 既存の権限状態に関わらず、必ず許可ダイアログを表示
    const { status } = await Notifications.requestPermissionsAsync();

    return {
      status,
      canAskAgain: true,
    };
  }, []);

  // プッシュ通知トークンの取得
  const getExpoPushToken = useCallback(async () => {
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      console.log('Project ID:', projectId);

      if (!projectId) {
        throw new Error('Project ID が設定されていません');
      }

      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      console.log('取得したトークン:', token);
      setExpoPushToken(token);

      if (user?.uid) {
        await saveExpoPushToken(user.uid, token);
        await updateNotificationSettings(user.uid, { isPushNotificationEnabled: true });
      }

      return token;
    } catch (error) {
      console.error('Failed to get push token:', error);
      setError({
        code: 'token_error',
        message: 'プッシュ通知トークンの取得に失敗しました',
        recoverable: true,
      });
      throw error;
    }
  }, [user]);

  // 通知設定の更新
  const updateSettings = useCallback(
    async (isEnabled: boolean) => {
      if (!user?.uid) return;

      try {
        await updateNotificationSettings(user.uid, {
          isPushNotificationEnabled: isEnabled,
        });

        if (isEnabled && !expoPushToken) {
          await getExpoPushToken();
        }
      } catch (error) {
        console.error('Failed to update notification settings:', error);
        setError({
          code: 'settings_error',
          message: '通知設定の更新に失敗しました',
          recoverable: true,
        });
        throw error;
      }
    },
    [user, expoPushToken, getExpoPushToken]
  );

  // エラーのクリア
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    expoPushToken,
    error,
    requestPermissions,
    getExpoPushToken,
    updateSettings,
    clearError,
  };
}
