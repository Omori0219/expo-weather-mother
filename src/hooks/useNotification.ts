import { useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useAuth } from './useAuth';
import { saveExpoPushToken, updateNotificationSettings } from '../services/notification';
import { ERROR_DOMAINS, createError, handleError } from '../lib/error/handler';
import type {
  NotificationPermissionStatus,
  NotificationPermissionState,
} from '../types/notification';

// プラットフォーム固有の設定
const getAndroidNotificationConfig = () => ({
  name: 'default',
  importance: Notifications.AndroidImportance.MAX,
  vibrationPattern: [0, 250, 250, 250],
  lightColor: '#FF231F7C',
});

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
      const config = getAndroidNotificationConfig();
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
            status: status as NotificationPermissionState,
            canAskAgain: status === 'undetermined',
          };
        }
        return {
          status: existingStatus as NotificationPermissionState,
          canAskAgain: false,
        };
      }

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        return {
          status: status as NotificationPermissionState,
          canAskAgain: true,
        };
      }

      return {
        status: existingStatus as NotificationPermissionState,
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

  // 通知設定の更新
  const updateSettings = useCallback(
    async (isEnabled: boolean) => {
      try {
        if (!user?.uid) {
          throw createError(
            'ユーザーが見つかりません',
            'user_not_found',
            ERROR_DOMAINS.NOTIFICATION
          );
        }

        await updateNotificationSettings(user.uid, {
          isPushNotificationEnabled: isEnabled,
          lastUpdated: new Date(),
        });
      } catch (error) {
        const message = handleError(error, ERROR_DOMAINS.NOTIFICATION);
        throw createError(message, 'settings_update_error', ERROR_DOMAINS.NOTIFICATION);
      }
    },
    [user]
  );

  return {
    expoPushToken,
    error,
    requestPermissions,
    getExpoPushToken,
    clearError,
    updateSettings,
  };
}
