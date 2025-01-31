import * as SecureStore from 'expo-secure-store';

// ストレージのキー
const KEYS = {
  AUTH_USER: 'auth_user',
  AUTH_TOKEN: 'auth_token',
} as const;

/**
 * 認証情報をセキュアに保存・取得するためのユーティリティ
 */
export const secureStorage = {
  /**
   * 認証ユーザー情報を保存
   */
  async setAuthUser(user: { uid: string; email: string | null }): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.AUTH_USER, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save auth user:', error);
      throw new Error('認証情報の保存に失敗しました');
    }
  },

  /**
   * 認証ユーザー情報を取得
   */
  async getAuthUser(): Promise<{ uid: string; email: string | null } | null> {
    try {
      const data = await SecureStore.getItemAsync(KEYS.AUTH_USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get auth user:', error);
      return null;
    }
  },

  /**
   * 認証トークンを保存
   */
  async setAuthToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Failed to save auth token:', error);
      throw new Error('認証トークンの保存に失敗しました');
    }
  },

  /**
   * 認証トークンを取得
   */
  async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  },

  /**
   * 認証情報を削除
   */
  async clearAuth(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(KEYS.AUTH_USER);
      await SecureStore.deleteItemAsync(KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Failed to clear auth:', error);
      throw new Error('認証情報の削除に失敗しました');
    }
  },
};
