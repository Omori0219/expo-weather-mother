export interface NotificationSettings {
  isPushNotificationEnabled: boolean;
  expoPushToken?: string;
}

export interface NotificationError {
  code: string;
  message: string;
  recoverable: boolean;
}

export interface NotificationPermissionStatus {
  status: 'granted' | 'denied' | 'undetermined';
  canAskAgain: boolean;
}
