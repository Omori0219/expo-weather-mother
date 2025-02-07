import { StyleSheet, View, Text, Image } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../../styles/weather/constants';

interface SpeechBubbleProps {
  message: string;
}

export function SpeechBubble({ message }: SpeechBubbleProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/app/img-speech-bubble.png')}
        style={styles.bubble}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  bubble: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.5, // 画像のアスペクト比に合わせて調整が必要かもしれません
    resizeMode: 'contain',
  },
  message: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    color: COLORS.TEXT_BLACK,
    fontSize: TYPOGRAPHY.MESSAGE.SIZE,
    lineHeight: TYPOGRAPHY.MESSAGE.LINE_HEIGHT,
    textAlign: 'center',
  },
});
