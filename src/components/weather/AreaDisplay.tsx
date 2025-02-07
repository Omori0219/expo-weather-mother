import { StyleSheet, Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../styles/weather/constants';

interface AreaDisplayProps {
  areaName: string;
}

export function AreaDisplay({ areaName }: AreaDisplayProps) {
  return <Text style={styles.area}>{areaName}</Text>;
}

const styles = StyleSheet.create({
  area: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.AREA.SIZE,
    lineHeight: TYPOGRAPHY.AREA.LINE_HEIGHT,
    fontWeight: TYPOGRAPHY.AREA.FONT_WEIGHT,
  },
});
