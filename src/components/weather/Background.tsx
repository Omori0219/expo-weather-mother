import { StyleSheet, View, Image } from 'react-native';
import { COLORS } from '../../styles/weather/constants';

export function Background() {
  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/app/img-japan-map.webp')} style={styles.map} />
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
    resizeMode: 'contain',
  },
});
