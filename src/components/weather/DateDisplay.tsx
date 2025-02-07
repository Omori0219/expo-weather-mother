import { StyleSheet, Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../styles/weather/constants';

interface DateDisplayProps {
  date: Date;
}

export function DateDisplay({ date }: DateDisplayProps) {
  const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

  return <Text style={styles.date}>{formattedDate}</Text>;
}

const styles = StyleSheet.create({
  date: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.DATE.SIZE,
    lineHeight: TYPOGRAPHY.DATE.LINE_HEIGHT,
    fontWeight: TYPOGRAPHY.DATE.FONT_WEIGHT,
  },
});
