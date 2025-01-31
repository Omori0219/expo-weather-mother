import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

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
