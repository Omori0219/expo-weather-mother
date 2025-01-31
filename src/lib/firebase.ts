import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirebaseConfig } from '../utils/env';

// Firebaseの設定を取得
const firebaseConfig = getFirebaseConfig();

/**
 * Firebase関連のサービスを初期化
 */
function initializeFirebaseServices() {
  try {
    // Firebaseアプリの初期化
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

    // Firestoreの初期化
    const db = getFirestore(app);

    // Firebase Authの初期化
    const auth = (() => {
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
        console.error('[Firebase Auth] 初期化エラー:', error);
        // Authの初期化に失敗した場合でも、基本的なAuthインスタンスを返す
        return getAuth(app);
      }
    })();

    return { app, db, auth };
  } catch (error) {
    console.error('[Firebase] 初期化エラー:', error);
    // 初期化に完全に失敗した場合は、アプリを続行できないのでエラーを投げる
    throw new Error('Firebaseの初期化に失敗しました');
  }
}

// Firebaseサービスの初期化と各インスタンスのエクスポート
const { db, auth } = initializeFirebaseServices();
export { db, auth };
