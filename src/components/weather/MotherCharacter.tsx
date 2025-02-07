import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

export function MotherCharacter() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/app/img-home-screen-mother.webp')}
        style={styles.image}
        contentFit="contain"
        cachePolicy="memory-disk"
        transition={300}
        priority="high"
      />
    </View>
  );
}

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
