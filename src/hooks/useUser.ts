import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db, firebaseAuth } from '../lib/firebase';
import type { UserDocument, UserData } from '../types/user';

export function useUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async user => {
      if (user) {
        await fetchUserData();
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // ユーザーデータの取得
  const fetchUserData = useCallback(async () => {
    const user = firebaseAuth.getCurrentUser();
    if (!user) {
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data() as UserDocument;
      const userData: UserData = {
        userId: data.userId,
        areaCode: data.areaCode,
        preferredPushNotificationTime: data.preferredPushNotificationTime,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };

      setUserData(userData);
      return userData;
    } catch (err) {
      setError('ユーザーデータの取得に失敗しました');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ユーザーデータの保存
  const saveUserData = useCallback(async (areaCode: string): Promise<boolean> => {
    let user = firebaseAuth.getCurrentUser();

    if (!user) {
      try {
        // 未認証の場合は匿名認証を行う
        user = await firebaseAuth.signInAnonymously();
      } catch (err) {
        setError('認証に失敗しました');
        return false;
      }
    }

    try {
      setIsLoading(true);
      setError(null);

      const now = Timestamp.now();
      const userData: UserDocument = {
        userId: user.uid,
        areaCode,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      setUserData({
        userId: user.uid,
        areaCode,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      });

      return true;
    } catch (err) {
      setError('ユーザーデータの保存に失敗しました');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    userData,
    fetchUserData,
    saveUserData,
  };
}
