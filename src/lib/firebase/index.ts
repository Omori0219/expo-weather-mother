import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getConfig } from './config';

/**
 * Firebaseアプリのインスタンスを取得する
 * 未初期化の場合は初期化を行う
 */
function getFirebaseApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const config = getConfig();
  return initializeApp(config);
}

// Firebaseアプリの初期化
const app = getFirebaseApp();

// Firestoreの初期化
export const db = getFirestore(app);

// Firebase Authの初期化
export const auth = getAuth(app);

// アプリインスタンスのエクスポート
export { app };
