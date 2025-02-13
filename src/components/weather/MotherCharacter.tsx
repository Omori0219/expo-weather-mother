import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { memo } from 'react';

export const MotherCharacter = memo(() => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/app/img-home-screen-mother.webp')}
        style={styles.image}
        contentFit="contain"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: undefined,
    aspectRatio: 1.075, // 実際の画像サイズ（W:402, H:374）に基づく比率
  },
});
