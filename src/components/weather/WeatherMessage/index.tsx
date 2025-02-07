import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { SpeechBubble } from './SpeechBubble';

interface WeatherMessageProps {
  message: string;
}

export function WeatherMessage({ message }: WeatherMessageProps) {
  const { width: screenWidth } = useWindowDimensions();
  const containerWidth = screenWidth * 0.99; // 画面幅の95%

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <SpeechBubble message={message} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center', // 中央寄せ
  },
});
