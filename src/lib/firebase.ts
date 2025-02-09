import { initializeApp, getApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth';
import Constants from 'expo-constants';
import type { AppConfig } from '../types/env';

/**
 * 環境変数を安全に取得する
 * @throws {Error} 必要な環境変数が設定されていない場合
 */
function getFirebaseConfig(): FirebaseOptions {
  const config = Constants.expoConfig as AppConfig;

  // デバッグ用：設定値の確認
  console.log('Config:', {
    hasExtra: !!config?.extra,
    extraKeys: config?.extra ? Object.keys(config.extra) : [],
  });

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

  // デバッグ用：環境変数の存在確認
  console.log('Firebase Config Values:', {
    hasApiKey: !!firebaseApiKey,
    hasAuthDomain: !!firebaseAuthDomain,
    hasProjectId: !!firebaseProjectId,
    hasStorageBucket: !!firebaseStorageBucket,
    hasMessagingSenderId: !!firebaseMessagingSenderId,
    hasAppId: !!firebaseAppId,
    hasMeasurementId: !!firebaseMeasurementId,
  });

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

/**
 * Firebaseアプリのインスタンスを取得する
 * 未初期化の場合は初期化を行う
 */
function getFirebaseApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const config = getFirebaseConfig();
  return initializeApp(config);
}

// Firebaseアプリの初期化
const app = getFirebaseApp();

// Firebase Authの初期化
export const auth = getAuth(app);

// Firestoreの初期化
export const db = getFirestore(app);

/**
 * Firebase認証に関するユーティリティ
 */
export const firebaseAuth = {
  /**
   * 現在の認証ユーザーを取得
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  /**
   * 匿名認証でサインイン
   */
  async signInAnonymously(): Promise<User> {
    try {
      const { user } = await signInAnonymously(auth);
      return user;
    } catch (error) {
      console.error('[Firebase Auth] 匿名認証エラー:', error);
      throw new Error('匿名認証に失敗しました');
    }
  },

  /**
   * サインアウト
   */
  async signOut(): Promise<void> {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('[Firebase Auth] サインアウトエラー:', error);
      throw new Error('サインアウトに失敗しました');
    }
  },

  /**
   * 認証状態の変更を監視
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  },
};
