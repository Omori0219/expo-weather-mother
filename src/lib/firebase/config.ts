import { getFirebaseConfig } from '../../utils/env';
import type { FirebaseOptions } from 'firebase/app';

let cachedConfig: FirebaseOptions | null = null;

/**
 * Firebase設定を取得する
 * 設定値をキャッシュし、複数回の呼び出しで同じ設定値を返すことを保証する
 */
export function getConfig(): FirebaseOptions {
  if (cachedConfig) {
    return cachedConfig;
  }

  // 環境変数から設定を取得
  const config = getFirebaseConfig();

  // 設定をキャッシュ
  cachedConfig = config;

  return config;
}
