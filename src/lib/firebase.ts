import { initializeApp, getApp } from 'firebase/app';
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
};

// Firebaseアプリの取得または初期化
function getFirebaseApp() {
  try {
    return getApp();
  } catch {
    return initializeApp(firebaseConfig);
  }
}

// Firebaseの認証インスタンスの取得または初期化
function getFirebaseAuth(app: any) {
  try {
    return getAuth(app);
  } catch {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
}

// アプリケーションの初期化
const app = getFirebaseApp();

// Firestore初期化
export const db = getFirestore(app);

// Auth初期化
export const auth = getFirebaseAuth(app);

// 必要なユーティリティ関数のエクスポート
export { getApp, getAuth };
