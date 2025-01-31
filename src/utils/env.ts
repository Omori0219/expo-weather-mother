import Constants from 'expo-constants';
import type { AppConfig } from '../types/env';

/**
 * 環境変数を安全に取得する
 * @throws {Error} 必要な環境変数が設定されていない場合
 */
export function getFirebaseConfig() {
  const config = Constants.expoConfig as AppConfig;

  if (!config?.extra) {
    throw new Error('環境変数が設定されていません');
  }

  const {
    firebaseApiKey,
    firebaseAuthDomain,
    firebaseProjectId,
    firebaseStorageBucket,
    firebaseMessagingSenderId,
    firebaseAppId,
    firebaseMeasurementId,
  } = config.extra;

  // 必須の環境変数をチェック
  const requiredEnvVars = {
    firebaseApiKey,
    firebaseAuthDomain,
    firebaseProjectId,
    firebaseStorageBucket,
    firebaseMessagingSenderId,
    firebaseAppId,
  };

  // 未設定の環境変数がないかチェック
  const missingEnvVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingEnvVars.length > 0) {
    throw new Error(`必要な環境変数が設定されていません: ${missingEnvVars.join(', ')}`);
  }

  return {
    apiKey: firebaseApiKey,
    authDomain: firebaseAuthDomain,
    projectId: firebaseProjectId,
    storageBucket: firebaseStorageBucket,
    messagingSenderId: firebaseMessagingSenderId,
    appId: firebaseAppId,
    measurementId: firebaseMeasurementId,
  };
}
