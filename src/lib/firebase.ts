import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirebaseConfig } from '../utils/env';

// Firebaseの設定を取得
const firebaseConfig = getFirebaseConfig();

// Firebaseの初期化
function initializeFirebase(): FirebaseApp {
  try {
    if (getApps().length === 0) {
      return initializeApp(firebaseConfig);
    }
    return getApp();
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    throw new Error('Firebaseの初期化に失敗しました');
  }
}

// Firebaseアプリのインスタンスを取得
export const app = initializeFirebase();

// Firestoreのインスタンスを取得
export const db = getFirestore(app);

// Firebase Authの初期化
function initializeFirebaseAuth(app: FirebaseApp) {
  try {
    // 既存のAuth インスタンスがあれば再利用
    const existingAuth = getAuth(app);
    if (existingAuth) {
      return existingAuth;
    }

    // 新しいAuth インスタンスを作成
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Auth:', error);
    throw new Error('Firebase認証の初期化に失敗しました');
  }
}

// Authのインスタンスを取得
export const auth = initializeFirebaseAuth(app);

// 必要なユーティリティ関数のエクスポート
export { getApp, getAuth };
