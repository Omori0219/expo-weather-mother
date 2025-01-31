import { signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth';
import { secureStorage } from './secure-storage';
import { auth } from './firebase';

/**
 * Firebase認証に関するユーティリティ
 */
export const firebaseAuth = {
  /**
   * 現在の認証ユーザーを取得
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  /**
   * 匿名認証でサインイン
   */
  async signInAnonymously(): Promise<User> {
    try {
      const { user } = await signInAnonymously(auth);

      // セキュアストレージに保存
      await secureStorage.setAuthUser({
        uid: user.uid,
        email: user.email,
      });

      if (user.refreshToken) {
        await secureStorage.setAuthToken(user.refreshToken);
      }

      return user;
    } catch (error) {
      console.error('[Firebase Auth] 匿名認証エラー:', error);
      throw new Error('匿名認証に失敗しました');
    }
  },

  /**
   * サインアウト
   */
  async signOut(): Promise<void> {
    try {
      await auth.signOut();
      await secureStorage.clearAuth();
    } catch (error) {
      console.error('[Firebase Auth] サインアウトエラー:', error);
      throw new Error('サインアウトに失敗しました');
    }
  },

  /**
   * 認証状態の変更を監視
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  },
};
