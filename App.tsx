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

// デバッグ: スプラッシュ画面の設定を確認
console.log('Splash Screen Config:', {
  plugins: Constants.expoConfig?.plugins,
  splash: Constants.expoConfig?.splash,
  assets: Constants.manifest?.assets,
});

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
        // デバッグ用のログ出力
        console.log('Environment variables:', {
          skipSetup: Constants.expoConfig?.extra?.skipSetup,
          defaultArea: Constants.expoConfig?.extra?.defaultArea,
        });
        // 必要な初期化処理をここに記述
        // 例: フォントのロード、初期データの取得など
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
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
