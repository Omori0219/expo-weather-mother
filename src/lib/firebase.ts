import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirebaseConfig } from '../utils/env';

// Firebaseの設定を取得
const firebaseConfig = getFirebaseConfig();

let app: FirebaseApp;
let db: ReturnType<typeof getFirestore>;
let auth: ReturnType<typeof getAuth>;

/**
 * Firebase関連のサービスを初期化
 */
function initializeFirebaseServices() {
  if (!app) {
    try {
      // Firebaseアプリの初期化（既に初期化されている場合は既存のインスタンスを取得）
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

      // Firestoreの初期化
      db = getFirestore(app);

      // Firebase Authの初期化
      try {
        // 既存のAuth インスタンスがあれば再利用
        auth = getAuth(app);
      } catch (error) {
        console.error('[Firebase Auth] 初期化エラー:', error);
        // Authの初期化に失敗した場合でも、基本的なAuthインスタンスを返す
        auth = getAuth(app);
      }
    } catch (error) {
      console.error('[Firebase] 初期化エラー:', error);
      throw new Error('Firebaseの初期化に失敗しました');
    }
  }

  return { app, db, auth };
}

// Firebaseサービスの初期化と各インスタンスのエクスポート
const { db: initializedDb, auth: initializedAuth } = initializeFirebaseServices();
export { initializedDb as db, initializedAuth as auth };
