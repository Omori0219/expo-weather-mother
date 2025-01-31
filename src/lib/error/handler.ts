import * as Sentry from 'sentry-expo';

export const ERROR_DOMAINS = {
  NOTIFICATION: 'notification',
  WEATHER: 'weather',
  AUTH: 'auth',
  SETUP: 'setup',
  UNKNOWN: 'unknown',
} as const;

export type ErrorDomain = (typeof ERROR_DOMAINS)[keyof typeof ERROR_DOMAINS];

interface CustomError extends Error {
  code?: string;
  domain?: ErrorDomain;
  recoverable?: boolean;
}

/**
 * エラーを作成する
 * @param message エラーメッセージ
 * @param code エラーコード
 * @param domain エラードメイン
 * @param recoverable 回復可能なエラーかどうか
 * @returns カスタムエラー
 */
export function createError(
  message: string,
  code: string,
  domain: ErrorDomain,
  recoverable = true
): CustomError {
  const error = new Error(message) as CustomError;
  error.code = code;
  error.domain = domain;
  error.recoverable = recoverable;
  return error;
}

/**
 * エラーを処理する
 * @param error エラー
 * @param domain エラードメイン
 * @returns エラーメッセージ
 */
export function handleError(error: unknown, domain: ErrorDomain): string {
  // エラーをSentryに送信
  Sentry.Native.captureException(error, {
    tags: {
      domain,
    },
  });

  // エラーメッセージを生成
  if (error instanceof Error) {
    const customError = error as CustomError;
    if (customError.domain === domain) {
      return customError.message;
    }
  }

  // デフォルトのエラーメッセージ
  const defaultMessages: Record<ErrorDomain, string> = {
    [ERROR_DOMAINS.NOTIFICATION]: '通知の設定中にエラーが発生しました',
    [ERROR_DOMAINS.WEATHER]: '天気情報の取得中にエラーが発生しました',
    [ERROR_DOMAINS.AUTH]: '認証中にエラーが発生しました',
    [ERROR_DOMAINS.SETUP]: '設定中にエラーが発生しました',
    [ERROR_DOMAINS.UNKNOWN]: 'エラーが発生しました',
  };

  return defaultMessages[domain] || defaultMessages[ERROR_DOMAINS.UNKNOWN];
}

/**
 * エラーがカスタムエラーかどうかを判定する
 * @param error エラー
 * @returns カスタムエラーかどうか
 */
export function isCustomError(error: unknown): error is CustomError {
  return error instanceof Error && 'code' in error && 'domain' in error;
}

/**
 * エラーが回復可能かどうかを判定する
 * @param error エラー
 * @returns 回復可能かどうか
 */
export function isRecoverableError(error: unknown): boolean {
  if (!isCustomError(error)) return true;
  return error.recoverable !== false;
}

export const showErrorToast = (message: string) => {
  // TODO: 実際のトースト表示ロジックを実装
  console.error(message);
};
