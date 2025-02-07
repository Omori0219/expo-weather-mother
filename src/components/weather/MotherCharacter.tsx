import { StyleSheet, View, Image } from 'react-native';

export function MotherCharacter() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/app/img-home-screen-mother.png')}
        style={styles.image}
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
    resizeMode: 'contain',
  },
});
