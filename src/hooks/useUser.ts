import { useState, useCallback } from 'react';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../lib/firebase';
import type { UserDocument, UserData } from '../types/user';

export function useUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  // ユーザーデータの取得
  const fetchUserData = useCallback(async () => {
    const auth = getAuth();
    if (!auth.currentUser) {
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));

      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data() as UserDocument;
      const userData: UserData = {
        areaCode: data.areaCode,
        createdAt: data.createdAt.toDate(),
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
  const saveUserData = useCallback(async (areaCode: string) => {
    const auth = getAuth();
    if (!auth.currentUser) {
      throw new Error('ユーザーが認証されていません');
    }

    try {
      setIsLoading(true);
      setError(null);

      const userData: UserDocument = {
        areaCode,
        createdAt: Timestamp.now(),
      };

      await setDoc(doc(db, 'users', auth.currentUser.uid), userData);

      setUserData({
        areaCode,
        createdAt: userData.createdAt.toDate(),
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
