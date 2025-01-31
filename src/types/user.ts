import { Timestamp } from 'firebase/firestore';

// Firestoreに保存するドキュメントの型
export interface UserDocument {
  userId: string;
  areaCode: string;
  preferredPushNotificationTime?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// アプリ内で使用するデータの型
export interface UserData {
  userId: string;
  areaCode: string;
  preferredPushNotificationTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 地域データの型定義
export interface AreaData {
  areaCode: string;
  areaName: string;
}
