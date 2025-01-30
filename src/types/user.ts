export interface UserData {
  userId: string;
  areaCode?: string;
  preferredPushNotificationTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 地域データの型定義
export interface AreaData {
  areaCode: string;
  areaName: string;
}
