# リファクタリング計画書

## 🚨 高優先度タスク
### 1. 型定義のモジュール化改善
```typescript
// src/types/notification/index.ts
export type NotificationSettings = {
  enabled: boolean;
  schedule: NotificationSchedule;
};

// src/types/notification/schedule.ts
export type NotificationSchedule = {
  time: string;
  timezone: string;
};
```

### 2. フックの責任分離
```typescript
// src/hooks/useNotificationRegistration.ts
export const useNotificationRegistration = () => {
  // 通知登録ロジック
};

// src/hooks/useNotificationStatus.ts
export const useNotificationStatus = () => {
  // ステータス管理ロジック
};
```

## ⚠️ 中優先度タスク
### 3. コンポーネント分割設計
```tsx
// src/components/settings/NotificationChannelSetting.tsx
const NotificationChannelSetting = ({ channel }: { channel: string }) => {
  // チャンネル別設定コンポーネント
};

// src/components/settings/NotificationTimePicker.tsx
const NotificationTimePicker = () => {
  // 時間選択コンポーネント
};
```

### 4. ナビゲーション型強化
```typescript
// src/types/navigation.ts
export type RootStackParamList = {
  Setup: { initialStep?: number };
  Main: NavigatorScreenParams<DrawerParamList>;
  Error: { message: string };
};
```

## 🔧 低優先度タスク
### 5. 環境変数バリデーション
```typescript
// src/utils/envValidator.ts
import { z } from 'zod';

const envSchema = z.object({
  API_ENDPOINT: z.string().url(),
  FIREBASE_CONFIG: z.string().transform(JSON.parse)
});

export type ValidatedEnv = z.infer<typeof envSchema>;
```

### 6. プロバイダ統合パターン
```tsx
// src/contexts/RootProvider.tsx
export const RootProvider = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <NotificationProvider>
      <UserDataProvider>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </UserDataProvider>
    </NotificationProvider>
  </AuthProvider>
);
```

### 7. 統一エラーハンドリング
```typescript
// src/lib/errorHandler.ts
import * as Sentry from 'sentry-expo';

export const handleAPIError = (error: unknown) => {
  if (error instanceof APIError) {
    Sentry.captureException(error);
    showErrorToast(error.localizedMessage);
  }
};
