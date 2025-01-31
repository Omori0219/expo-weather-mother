export type NotificationPermissionState = 'granted' | 'denied' | 'undetermined';

export interface NotificationSettings {
  isPushNotificationEnabled: boolean | null;
  permissionState: NotificationPermissionState;
  lastUpdated: Date;
  expoPushToken?: string;
}

export interface NotificationPermissionStatus {
  status: NotificationPermissionState;
  canAskAgain: boolean;
}

export interface NotificationError {
  code: 'permission_denied' | 'token_error' | 'settings_error' | 'device_not_supported';
  message: string;
  recoverable: boolean;
}
