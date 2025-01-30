import { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../types/navigation';
import { useAuth } from '../hooks/useAuth';

export function SplashScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user } = useAuth();

  useEffect(() => {
    // スプラッシュ画面を2秒間表示
    const timer = setTimeout(() => {
      // ユーザーの状態に応じて画面遷移
      if (user) {
        // ユーザーの都道府県設定を確認する処理は後で実装
        navigation.replace('Setup');
      } else {
        navigation.replace('Setup');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, user]);

  return (
    <View style={styles.container}>
      {/* TODO: ロゴ画像を後で差し替え */}
      <Image
        source={require('../../assets/splash-logo-placeholder.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
