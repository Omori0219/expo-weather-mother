import { StyleSheet, View } from 'react-native';
import { SpeechBubble } from './SpeechBubble';

interface WeatherMessageProps {
  message: string;
}

export function WeatherMessage({ message }: WeatherMessageProps) {
  return (
    <View style={styles.container}>
      <SpeechBubble message={message} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
});
