import * as Sentry from 'sentry-expo';

export const ERROR_DOMAINS = {
  NOTIFICATION: 'notification',
  USER: 'user',
  WEATHER: 'weather',
  SETUP: 'setup',
} as const;

export type ErrorDomain = (typeof ERROR_DOMAINS)[keyof typeof ERROR_DOMAINS];

export interface AppError extends Error {
  code: string;
  userMessage: string;
  domain: ErrorDomain;
  recoverable: boolean;
}

export const createError = (
  message: string,
  code: string,
  domain: ErrorDomain,
  recoverable = true
): AppError => ({
  name: 'AppError',
  message,
  code,
  userMessage: message,
  domain,
  recoverable,
});

export const handleError = (error: unknown, domain: ErrorDomain) => {
  if (error instanceof Error) {
    // 開発環境でのデバッグ用にコンソールにエラーを出力
    console.error(`[${domain}] Error:`, error);
    return error.message;
  }
  return '予期せぬエラーが発生しました';
};

export const showErrorToast = (message: string) => {
  // TODO: 実際のトースト表示ロジックを実装
  console.error(message);
};
