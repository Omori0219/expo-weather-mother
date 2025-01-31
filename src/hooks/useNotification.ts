import { useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useAuth } from './useAuth';
import { saveExpoPushToken, updateNotificationSettings } from '../services/notification';
import {
  NotificationError,
  NotificationPermissionStatus,
  NotificationSettings,
} from '../types/notification';

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
      throw {
        code: 'device_not_supported',
        message: '実機以外での通知機能はサポートされていません',
        recoverable: false,
      } as NotificationError;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // 現在の権限状態を確認
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('既存の通知許可状態:', existingStatus);

    // iOS の場合の処理
    if (Platform.OS === 'ios') {
      // 未設定の場合のみ許可ダイアログを表示
      if (existingStatus === 'undetermined') {
        const { status } = await Notifications.requestPermissionsAsync();
        return {
          status,
          // iOSの場合、undeterminedの場合のみ再度許可を求めることができる
          canAskAgain: status === 'undetermined',
        };
      }
      // 既に設定済みの場合は現在の状態を返す
      return {
        status: existingStatus,
        // denied の場合は設定アプリから変更する必要がある
        canAskAgain: false,
      };
    }

    // Android の場合の処理
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      return {
        status,
        // Androidの場合は常に再度許可を求めることができる
        canAskAgain: true,
      };
    }

    return {
      status: existingStatus,
      canAskAgain: true,
    };
  }, []);

  // プッシュ通知トークンの取得
  const getExpoPushToken = useCallback(async () => {
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      console.log('Project ID:', projectId);

      if (!projectId) {
        throw {
          code: 'token_error',
          message: 'Project ID が設定されていません',
          recoverable: false,
        } as NotificationError;
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
        // 通知設定の更新は呼び出し側で行うため、ここでは行わない
      }

      return token;
    } catch (error) {
      console.error('Failed to get push token:', error);
      const notificationError: NotificationError = {
        code: 'token_error',
        message: 'プッシュ通知トークンの取得に失敗しました',
        recoverable: true,
      };
      setError(notificationError);
      throw notificationError;
    }
  }, [user]);

  // 通知設定の更新
  const updateSettings = useCallback(
    async (settings: Partial<NotificationSettings>) => {
      if (!user?.uid) return;

      try {
        await updateNotificationSettings(user.uid, {
          ...settings,
          lastUpdated: new Date(),
        });
      } catch (error) {
        console.error('Failed to update notification settings:', error);
        const notificationError: NotificationError = {
          code: 'settings_error',
          message: '通知設定の更新に失敗しました',
          recoverable: true,
        };
        setError(notificationError);
        throw notificationError;
      }
    },
    [user]
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
