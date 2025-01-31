import { useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useAuth } from './useAuth';
import { saveExpoPushToken, updateNotificationSettings } from '../services/notification';
import { ERROR_DOMAINS, createError, handleError } from '../lib/error/handler';
import type { NotificationPermissionStatus } from '../types/notification';

// プラットフォーム固有の設定
const getPlatformNotificationConfig = () => {
  if (Platform.OS === 'android') {
    return {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    };
  }
  return null;
};

// 通知ハンドラーの設定
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
  const [error, setError] = useState<Error | null>(null);

  // デバイスチェック
  const checkDevice = useCallback(() => {
    if (!Device.isDevice) {
      throw createError(
        '実機以外での通知機能はサポートされていません',
        'device_not_supported',
        ERROR_DOMAINS.NOTIFICATION,
        false
      );
    }
  }, []);

  // Android用チャンネル設定
  const setupAndroidChannel = useCallback(async () => {
    if (Platform.OS === 'android') {
      const config = getPlatformNotificationConfig();
      await Notifications.setNotificationChannelAsync('default', config);
    }
  }, []);

  // 通知権限の取得
  const requestPermissions = useCallback(async (): Promise<NotificationPermissionStatus> => {
    try {
      checkDevice();
      await setupAndroidChannel();

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('既存の通知許可状態:', existingStatus);

      if (Platform.OS === 'ios') {
        if (existingStatus === 'undetermined') {
          const { status } = await Notifications.requestPermissionsAsync();
          return {
            status,
            canAskAgain: status === 'undetermined',
          };
        }
        return {
          status: existingStatus,
          canAskAgain: false,
        };
      }

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        return {
          status,
          canAskAgain: true,
        };
      }

      return {
        status: existingStatus,
        canAskAgain: true,
      };
    } catch (error) {
      const message = handleError(error, ERROR_DOMAINS.NOTIFICATION);
      throw createError(message, 'permission_error', ERROR_DOMAINS.NOTIFICATION);
    }
  }, [checkDevice, setupAndroidChannel]);

  // プッシュ通知トークンの取得
  const getExpoPushToken = useCallback(async () => {
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        throw createError(
          'Project ID が設定されていません',
          'config_error',
          ERROR_DOMAINS.NOTIFICATION
        );
      }

      const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('取得したトークン:', token);
      setExpoPushToken(token);

      if (user?.uid) {
        await saveExpoPushToken(user.uid, token);
      }

      return token;
    } catch (error) {
      const message = handleError(error, ERROR_DOMAINS.NOTIFICATION);
      throw createError(message, 'token_error', ERROR_DOMAINS.NOTIFICATION);
    }
  }, [user]);

  // エラーのクリア
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    expoPushToken,
    error,
    requestPermissions,
    getExpoPushToken,
    clearError,
  };
}
