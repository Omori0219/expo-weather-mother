import { Timestamp } from 'firebase/firestore';

export interface UserDocument {
  areaCode: string;
  createdAt: Timestamp;
}

export interface UserData {
  areaCode?: string;
  createdAt?: Date;
}

// 地域データの型定義
export interface AreaData {
  areaCode: string;
  areaName: string;
}
