import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { COLORS } from '../../styles/weather/constants';

export function Background() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/app/img-japan-map.webp')}
        style={styles.map}
        contentFit="contain" // resizeModeの代わりにcontentFitを使用
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.BACKGROUND,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});
