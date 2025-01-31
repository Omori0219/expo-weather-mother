import { ExpoConfig } from 'expo/config';

// app.config.tsのextra内の型定義
export interface ExtraConfig {
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  firebaseStorageBucket: string;
  firebaseMessagingSenderId: string;
  firebaseAppId: string;
  firebaseMeasurementId?: string;
  eas: {
    projectId: string;
  };
}

// Constants.expoConfigの型定義を拡張
export interface AppConfig extends ExpoConfig {
  extra: ExtraConfig;
}
