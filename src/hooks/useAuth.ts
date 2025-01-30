import { useState, useEffect } from 'react';
import { User, signInAnonymously } from 'firebase/auth';
import { auth } from '../config/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 認証状態の監視
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });

    // クリーンアップ
    return () => unsubscribe();
  }, []);

  // 匿名サインイン
  const signInAnonymouslyAsync = async () => {
    try {
      const result = await signInAnonymously(auth);
      return result.user;
    } catch (error) {
      console.error('Anonymous sign in error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signInAnonymouslyAsync,
  };
}
