# リファクタリング計画書

## 📋 実装フェーズ1（最優先）

### 1. 型定義の整理と強化
#### 実装内容
```typescript
// src/types/index.ts
export * from './auth';
export * from './notification';
export * from './user';
export * from './weather';

// src/types/notification/index.ts
export type NotificationSettings = {
  enabled: boolean;
  schedule: NotificationSchedule;
  preferences: NotificationPreferences;
};

// src/types/notification/schedule.ts
export type NotificationSchedule = {
  time: string;
  timezone: string;
  days: DayOfWeek[];
};
```

#### 🎯 目標
- 型定義の一元管理
- ランタイムバリデーションの導入
- 型の再利用性向上

#### ⚠️ リスク評価
- リスクレベル: 低
- 想定される問題:
  - 既存コードとの型互換性の一時的な喪失
  - ビルド時のエラー増加
- 対策:
  - 段階的な移行
  - 包括的なテストの実施

### 2. フックの責任分離と最適化
#### 実装内容
```typescript
// src/hooks/notification/useNotificationPermission.ts
export const useNotificationPermission = () => {
  // 権限管理に特化
};

// src/hooks/notification/useNotificationSchedule.ts
export const useNotificationSchedule = () => {
  // スケジュール管理に特化
};

// src/hooks/notification/useNotificationDelivery.ts
export const useNotificationDelivery = () => {
  // 配信管理に特化
};
```

#### 🎯 目標
- ビジネスロジックの分離
- テスト容易性の向上
- 再利用性の向上

#### ⚠️ リスク評価
- リスクレベル: 中
- 想定される問題:
  - 通知機能の一時的な不具合
  - パフォーマンスへの影響
- 対策:
  - 段階的なリファクタリング
  - 各フックの詳細なテスト
  - パフォーマンスモニタリング

### 3. エラーハンドリング基盤の確立
#### 実装内容
```typescript
// src/lib/error/handler.ts
import * as Sentry from 'sentry-expo';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string
  ) {
    super(message);
  }
}

export const errorHandler = {
  handle: (error: unknown) => {
    if (error instanceof AppError) {
      Sentry.captureException(error);
      showErrorToast(error.userMessage);
    }
  }
};
```

#### 🎯 目標
- エラー追跡の改善
- ユーザー体験の向上
- デバッグ容易性の向上

#### ⚠️ リスク評価
- リスクレベル: 中
- 想定される問題:
  - エラーハンドリングの漏れ
  - エラーメッセージの不適切な表示
- 対策:
  - エラーバウンダリーの導入
  - 段階的な移行
  - エラーログの監視強化

## 📋 実装フェーズ2（高優先度）

### 1. テスト基盤の整備
#### 実装内容
```typescript
// src/tests/hooks/useNotification.test.ts
import { renderHook } from '@testing-library/react-hooks';
import { useNotification } from '../hooks/useNotification';

describe('useNotification', () => {
  it('should handle permission request', async () => {
    const { result } = renderHook(() => useNotification());
    // テストケース
  });
});
```

#### 🎯 目標
- テストカバレッジの向上
- 回帰バグの防止
- CI/CDの整備

#### ⚠️ リスク評価
- リスクレベル: 低
- 想定される問題:
  - テスト実装による開発速度の一時的な低下
  - 誤ったテストケースによる誤検知
- 対策:
  - 重要度の高い機能から段階的に実装
  - テストケースのレビュー体制の確立

### 2. コンポーネントの分割と最適化
#### 実装内容
```typescript
// src/components/notification/NotificationSettings.tsx
export const NotificationSettings = () => {
  const { settings } = useNotificationSettings();
  return (
    <>
      <SchedulePicker />
      <PreferenceSelector />
      <EnableToggle />
    </>
  );
};
```

#### 🎯 目標
- コンポーネントの責務明確化
- 再利用性の向上
- パフォーマンスの最適化

#### ⚠️ リスク評価
- リスクレベル: 中
- 想定される問題:
  - UIの一時的な不整合
  - パフォーマンスの一時的な低下
- 対策:
  - コンポーネントごとの段階的な移行
  - パフォーマンステストの実施
  - UIテストの強化

### 3. 環境変数管理の改善
#### 実装内容
```typescript
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  API_URL: z.string().url(),
  FIREBASE_CONFIG: z.string(),
  SENTRY_DSN: z.string().url().optional(),
});

export const validateEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error('環境変数の検証に失敗しました');
  }
  return result.data;
};
```

#### 🎯 目標
- 環境変数の型安全性確保
- 設定ミスの早期発見
- デプロイ時の安全性向上

#### ⚠️ リスク評価
- リスクレベル: 中
- 想定される問題:
  - 既存の環境変数との互換性問題
  - デプロイパイプラインの一時的な破綻
- 対策:
  - 環境変数の完全な棚卸し
  - 移行計画の慎重な策定
  - バックアップ設定の用意

## 📋 実装フェーズ3（中優先度）

### 1. ナビゲーション構造の改善
#### 実装内容
```typescript
// src/navigation/index.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'ホーム' }} />
      <Stack.Screen name="settings" options={{ title: '設定' }} />
    </Stack>
  );
}
```

#### 🎯 目標
- expo-routerへの移行
- ディープリンク対応の強化
- ナビゲーション型の安全性向上

#### ⚠️ リスク評価
- リスクレベル: 高
- 想定される問題:
  - 画面遷移の一時的な不具合
  - ディープリンクの破損
  - 既存の画面構造との不整合
- 対策:
  - 段階的な移行
  - 包括的な画面遷移テスト
  - フォールバック機能の実装

### 2. 状態管理の最適化
#### 実装内容
```typescript
// src/stores/notificationStore.ts
import create from 'zustand';

interface NotificationStore {
  settings: NotificationSettings;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  settings: initialSettings,
  updateSettings: (newSettings) => 
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),
}));
```

#### 🎯 目標
- パフォーマンスの向上
- 状態管理の簡素化
- デバッグ容易性の向上

#### ⚠️ リスク評価
- リスクレベル: 高
- 想定される問題:
  - データの一時的な不整合
  - 状態更新の遅延
  - メモリリーク
- 対策:
  - 段階的な移行
  - 状態変更の監視
  - パフォーマンスモニタリング

### 3. セキュリティ強化
#### 実装内容
```typescript
// src/lib/security/storage.ts
import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  async set(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
  async get(key: string) {
    return await SecureStore.getItemAsync(key);
  }
};
```

#### 🎯 目標
- データ暗号化の強化
- セキュアストレージの導入
- 認証フローの改善

#### ⚠️ リスク評価
- リスクレベル: 中
- 想定される問題:
  - 既存データの移行問題
  - パフォーマンスへの影響
  - 認証の一時的な不具合
- 対策:
  - セキュリティ監査の実施
  - 段階的なデータ移行
  - フォールバックメカニズムの実装

## 📋 実装フェーズ4（低優先度）

### 1. i18n対応
#### 実装内容
```typescript
// src/i18n/index.ts
import i18n from 'i18next';

export const setupI18n = () => {
  i18n.init({
    resources: {
      ja: { translation: require('./ja.json') },
      en: { translation: require('./en.json') }
    },
    lng: 'ja',
    fallbackLng: 'ja'
  });
};
```

#### 🎯 目標
- 多言語対応の基盤整備
- 文字列のリソース化
- 地域ごとの最適化

#### ⚠️ リスク評価
- リスクレベル: 低
- 想定される問題:
  - 文字列の欠落
  - レイアウトの崩れ
  - パフォーマンスへの影響
- 対策:
  - 文字列の完全な抽出
  - レイアウトテスト
  - 段階的な導入

### 2. アクセシビリティ対応
#### 実装内容
```typescript
// src/components/common/Button.tsx
export const Button = ({ 
  onPress, 
  label,
  accessibilityLabel 
}: ButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    accessible={true}
    accessibilityLabel={accessibilityLabel || label}
    accessibilityRole="button"
  >
    <Text>{label}</Text>
  </TouchableOpacity>
);
```

#### 🎯 目標
- スクリーンリーダー対応
- キーボード操作対応
- コントラスト比の改善

#### ⚠️ リスク評価
- リスクレベル: 低
- 想定される問題:
  - UIの微細な変更
  - パフォーマンスへの影響
- 対策:
  - アクセシビリティテストの実施
  - ユーザーテストの実施
  - 段階的な改善

### 3. CI/CD整備
#### 実装内容
```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline
on:
  push:
    branches: [ main ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Dependencies
        run: yarn install
      - name: Run Tests
        run: yarn test
```

#### 🎯 目標
- 自動テストの整備
- デプロイの自動化
- コード品質チェックの自動化

#### ⚠️ リスク評価
- リスクレベル: 低
- 想定される問題:
  - ビルドの失敗
  - テスト環境の不整合
- 対策:
  - 段階的な導入
  - モニタリングの強化
  - ロールバック手順の整備

## 📊 進捗管理

各フェーズの完了基準:
1. コードレビュー完了
2. テスト成功
3. パフォーマンステスト通過
4. セキュリティチェック通過
5. アクセシビリティチェック通過

## 🔄 ロールバック計画

各リファクタリングステップに対して:
1. 変更前のコードのバックアップ
2. 変更の影響範囲の文書化
3. ロールバック手順の準備
4. モニタリング指標の設定

## 📈 モニタリング計画

1. パフォーマンス指標
   - 画面読み込み時間
   - メモリ使用量
   - バッテリー消費

2. エラー監視
   - クラッシュレート
   - エラー発生率
   - API応答時間

3. ユーザー体験指標
   - アプリ使用時間
   - 機能使用率
   - クラッシュフリーユーザー率
