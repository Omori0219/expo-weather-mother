import { Timestamp } from 'firebase/firestore';

export interface WeatherDocument {
  areaCode: string;
  weatherForecasts: string;
  generatedMessage: string;
  createdAt: Timestamp;
}

// パース後のメッセージの型
export interface GeneratedMessage {
  mother_message: string;
}

// 表示用のデータ型
export interface WeatherDisplayData {
  motherMessage: string;
  displayDate: string; // "MM月DD日" 形式
  areaName: string; // "石川県" 形式
}

// コンポーネントに渡すデータの型
export interface WeatherData {
  message: string;
  date: string;
  areaName: string;
}
