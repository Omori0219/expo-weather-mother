# 開発フロー

## 1. 初期設定とプロジェクト構造の確立
### feat: 🎉 #1 プロジェクトの初期設定
- [x] Expoプロジェクトの作成（`npx create-expo-app@latest --template blank-typescript .`）
- [x] 必要なディレクトリ構造の作成
  ```
  src/
  ├── components/     # 共通コンポーネント
  ├── screens/        # 画面コンポーネント
  ├── hooks/          # カスタムフック
  ├── services/       # Firebase等の外部サービス
  ├── config/         # 設定ファイル
  ├── types/          # 型定義
  ├── utils/          # ユーティリティ関数
  └── constants/      # 定数
  ```
- [x] .gitignoreの設定
- [x] ESLintとPrettierの設定
- [x] app.jsonの基本設定
  - アプリ名、バージョン、パーミッション等の設定

### feat: 📦 #2 必要なパッケージのインストール
- [x] Navigationパッケージのインストール
  ```bash
  npm install @react-navigation/native @react-navigation/native-stack
  npx expo install react-native-screens react-native-safe-area-context
  ```
- [x] Firebaseパッケージのインストール（Expo Managed Workflow用）
  ```bash
  npx expo install firebase
  ```
- [x] その他の必要なパッケージのインストール
  ```bash
  npx expo install expo-notifications expo-device expo-constants expo-updates
  ```

### feat: 🔧 #3 Firebase設定の実装
- [x] Firebase設定ファイルの作成
  - `src/config/firebase.ts`にFirebase構成オブジェクトを記述
- [x] 環境変数の設定
  - `.env`ファイルの作成
  - `app.config.ts`での環境変数の読み込み設定
- [x] Firebaseの初期化処理の実装
  - App.tsxでのFirebase初期化

## 2. 認証フローの実装
### feat: 🔐 #4 匿名認証の実装
- [x] 認証カスタムフックの作成（`src/hooks/useAuth.ts`）
  - 匿名サインイン関数
  - サインアウト関数
  - 認証状態の監視
- [x] 認証状態の管理実装
  - ユーザーのログイン状態（isAuthenticated）
  - ユーザーID（uid）
  - ローディング状態
- [x] 匿名サインインロジックの実装
  - アプリ起動時の自動サインイン
- [x] Firestoreユーザードキュメントの作成
  - ユーザー情報の型定義
  - Firestore操作用サービスの実装
  - 認証後の自動ドキュメント作成

## 3. 画面実装
### feat: 💫 #5 スプラッシュ画面の実装
- [ ] スプラッシュ画面のコンポーネント作成
- [ ] アプリアイコンとスプラッシュ画像の設定
- [ ] ローディングアニメーションの実装

### feat: 🎨 #6 初期設定画面の実装
- [ ] 都道府県選択コンポーネントの作成
- [ ] 都道府県データの定義（`src/constants/prefectures.ts`）
  ```typescript
  export const prefectures = [
    { id: 'hokkaido', name: '北海道', areaCode: '010000' },
    // ... その他の都道府県
  ] as const;
  ```
- [ ] Firestoreへの保存処理の実装
  - ユーザードキュメントの作成（`users/${uid}`）
  - 都道府県情報の保存
- [ ] バリデーションの実装

### feat: 📱 #7 メイン画面の実装
- [ ] 天気情報表示コンポーネントの作成
  - お天気おかんメッセージの表示
  - 更新日時の表示
  - エラー時の代替表示
- [ ] Firestoreからのデータ取得処理の実装
  ```typescript
  // 天気情報の型定義
  interface WeatherData {
    mother_message: string;
    created_at: string;
    area_code: string;
  }
  
  // データ取得処理
  const fetchWeatherData = async (areaCode: string) => {
    const today = format(new Date(), 'yyyyMMdd');
    const docId = `${today}-${areaCode}`;
    // Firestoreからデータを取得
  };
  ```
- [ ] エラー表示の実装
- [ ] ローディング表示の実装

## 4. プッシュ通知機能の実装
### feat: 🔔 #8 プッシュ通知の実装
- [ ] Expo通知の設定
- [ ] 通知許可の取得処理
- [ ] 通知トークンの保存処理
- [ ] 通知受信処理の実装

## 5. UI/UXの改善
### feat: ✨ #9 UI/UXの改善
- [ ] アニメーションの追加
- [ ] エラーハンドリングの改善
- [ ] ローディング表示の改善
- [ ] タッチフィードバックの実装

## 6. 最終調整
### feat: 🚀 #10 リリース準備
- [ ] アプリアイコンの最終調整
- [ ] スプラッシュ画面の最終調整
- [ ] バージョン番号の設定
- [ ] EAS Buildの設定
- [ ] eas.jsonの設定

## コミットメッセージフォーマット
```
<Type>: <Emoji> #<Issue Number> <Title>

<Body>
```

### Type
- feat: 新機能
- fix: バグ修正
- docs: ドキュメントのみの変更
- style: コードの意味に影響を与えない変更（空白、フォーマット、セミコロンの追加など）
- refactor: バグを修正したり機能を追加したりしないコードの変更
- test: テストの追加や既存のテストの修正
- chore: ビルドプロセスやドキュメント生成などの補助ツールやライブラリの変更

### Emoji
- 🎉 `:tada:` - プロジェクト開始
- 📦 `:package:` - パッケージの追加や更新
- 🔧 `:wrench:` - 設定ファイルの変更
- 🔐 `:lock:` - セキュリティ関連の実装
- 💫 `:dizzy:` - アニメーションやトランジションの実装
- 🎨 `:art:` - UIの改善やデザインの変更
- 📱 `:iphone:` - レスポンシブデザインの実装
- 🔔 `:bell:` - 通知関連の実装
- ✨ `:sparkles:` - 新機能の追加
- 🚀 `:rocket:` - パフォーマンス改善やデプロイ関連 
