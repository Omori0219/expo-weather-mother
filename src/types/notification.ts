export type NotificationPermissionState = 'granted' | 'denied' | 'undetermined';

export interface NotificationSettings {
  isPushNotificationEnabled: boolean;
  permissionState: NotificationPermissionState;
  expoPushToken?: string;
  lastUpdated: Date;
}

export interface NotificationPermissionStatus {
  status: NotificationPermissionState;
  canAskAgain: boolean;
}

export interface NotificationError extends Error {
  code: string;
  recoverable: boolean;
}
