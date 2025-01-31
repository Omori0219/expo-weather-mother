import { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '../types/navigation';
import { useUser } from '../hooks/useUser';

export function SplashScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { fetchUserData } = useUser();

  useEffect(() => {
    const checkUserData = async () => {
      try {
        // ユーザーデータを取得
        const userData = await fetchUserData();

        // 2秒後に画面遷移
        setTimeout(() => {
          if (userData?.areaCode) {
            // 地域コードが設定済みの場合はメイン画面へ
            navigation.replace('Main');
          } else {
            // 未設定の場合は設定画面へ
            navigation.replace('Setup');
          }
        }, 2000);
      } catch (error) {
        // エラー時は設定画面へ
        setTimeout(() => {
          navigation.replace('Setup');
        }, 2000);
      }
    };

    checkUserData();
  }, [navigation, fetchUserData]);

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
