import { StyleSheet, Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../styles/weather/constants';

interface DateDisplayProps {
  date: Date;
}

export function DateDisplay({ date }: DateDisplayProps) {
  // 日本時間でフォーマット
  const japanDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  const formattedDate = `${japanDate.getFullYear()}年${japanDate.getMonth() + 1}月${japanDate.getDate()}日`;

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
