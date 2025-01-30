import { Timestamp } from 'firebase/firestore';

export interface WeatherDocument {
  areaCode: string;
  weatherForecasts: string;
  generatedMessage: string;
  createdAt: Timestamp;
}

export interface WeatherData {
  message: string;
  date: string;
}
