import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './src/navigation/RootStack';
import { AuthProvider } from './src/contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { Image } from 'expo-image';

// デバッグ: スプラッシュ画面の設定を確認
console.log('Splash Screen Config:', {
  plugins: Constants.expoConfig?.plugins,
  splash: Constants.expoConfig?.splash,
  assets: Constants.manifest?.assets,
});

// プリロードする画像の定義
const PRELOAD_IMAGES = [
  require('./assets/app/img-home-screen-mother.webp'),
  require('./assets/app/img-japan-map.webp'),
  require('./assets/app/img-speech-bubble.webp'),
] as const;

// スプラッシュ画面を自動で隠さないようにする
SplashScreen.preventAutoHideAsync()
  .then(() => {
    console.log('Splash Screen: preventAutoHideAsync completed');
  })
  .catch(error => {
    console.error('Splash Screen Error:', error);
  });

// アニメーションオプションを設定
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // 並行して実行
        await Promise.all([
          // 画像のプリロード
          Promise.all(
            PRELOAD_IMAGES.map(image => {
              console.log('Preloading image:', image);
              return Image.prefetch(image);
            })
          ),
          // 必要な初期化処理をここに記述
          // 例: フォントのロード、初期データの取得など
          new Promise(resolve => setTimeout(resolve, 2000)),
        ]);
      } catch (error) {
        console.warn('Asset preloading failed:', error);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      try {
        console.log('Attempting to hide splash screen...');
        await SplashScreen.hideAsync();
        console.log('Splash screen hidden successfully');
      } catch (error) {
        console.error('Error hiding splash screen:', error);
      }
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  const initialState = Constants.expoConfig?.extra?.skipSetup
    ? {
        selectedArea: Constants.expoConfig?.extra?.defaultArea || '170000',
        notificationEnabled: true,
        isInitialSetupComplete: true,
      }
    : {
        selectedArea: null,
        notificationEnabled: false,
        isInitialSetupComplete: false,
      };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <AuthProvider initialState={initialState}>
            <NavigationContainer>
              <RootStack />
            </NavigationContainer>
          </AuthProvider>
        </SafeAreaProvider>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
