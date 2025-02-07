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
    width: '100%',
    height: undefined,
    aspectRatio: 1, // 画像のアスペクト比に合わせて調整が必要かもしれません
    resizeMode: 'contain',
  },
});
