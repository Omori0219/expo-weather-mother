import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase設定オブジェクト
const firebaseConfig = {
  apiKey: 'AIzaSyAUnl5SglXDITLeRzm7NBvaOKCEC6Xw64c',
  authDomain: 'caen-weathermother-prod.firebaseapp.com',
  projectId: 'caen-weathermother-prod',
  storageBucket: 'caen-weathermother-prod.firebasestorage.app',
  messagingSenderId: '179164196124',
  appId: '1:179164196124:web:b96803f0cd3b21f61eded9',
  measurementId: 'G-9CY1YFBV4Y',
};

// 設定値の確認用ログ
console.log('Firebase Config:', firebaseConfig);

// Firebaseの初期化
export const app = initializeApp(firebaseConfig);

// 認証の初期化
export const auth = getAuth(app);

// Firestoreの初期化
export const db = getFirestore(app);
