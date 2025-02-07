import { StyleSheet, View, Text, Image, useWindowDimensions } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../../styles/weather/constants';

interface SpeechBubbleProps {
  message: string;
}

export function SpeechBubble({ message }: SpeechBubbleProps) {
  const { width: screenWidth } = useWindowDimensions();
  const SPEECH_BUBBLE_ASPECT_RATIO = 1.2;
  const bubbleHeight = (screenWidth * 0.95) / SPEECH_BUBBLE_ASPECT_RATIO;

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/app/img-speech-bubble.png')}
        style={[styles.bubble, { height: bubbleHeight }]}
      />
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  bubble: {
    width: '100%',
    resizeMode: 'contain',
  },
  messageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '15%', // メッセージのパディング
    paddingVertical: '10%',
  },
  message: {
    color: COLORS.TEXT_BLACK,
    fontSize: TYPOGRAPHY.MESSAGE.SIZE,
    lineHeight: TYPOGRAPHY.MESSAGE.LINE_HEIGHT,
    textAlign: 'center',
  },
});
