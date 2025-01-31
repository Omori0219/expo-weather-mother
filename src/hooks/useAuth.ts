import { useState, useEffect } from 'react';
import {
  User,
  signInAnonymously as firebaseSignInAnonymously,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AuthState, UseAuth } from '../types/auth';
import { createUserDocument } from '../services/user';

export function useAuth(): UseAuth {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // 認証状態の監視
    const unsubscribe = auth.onAuthStateChanged(
      async user => {
        setState(prev => ({ ...prev, user, loading: false }));
        if (user) {
          try {
            await createUserDocument(user.uid);
          } catch (error) {
            console.error('Error creating user document:', error);
          }
        }
      },
      error => {
        setState(prev => ({ ...prev, error: error as Error, loading: false }));
      }
    );

    // クリーンアップ関数
    return () => unsubscribe();
  }, []);

  // 匿名サインイン
  const signInAnonymously = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      await firebaseSignInAnonymously(auth);
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // サインアウト
  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      await firebaseSignOut(auth);
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    signInAnonymously,
    signOut,
  };
}
