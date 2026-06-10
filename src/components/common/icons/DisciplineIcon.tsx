import { Text, StyleSheet } from 'react-native';
import type { Discipline } from '@/types/match';
import { typography } from '@/constants/theme';

interface DisciplineIconProps {
  discipline: Discipline;
  color?: string;
}

const DISCIPLINE_DISPLAY: Record<Discipline, string> = {
  '8ball': '⚫',
  '9ball': '🟡',
  '10ball': '🔵',
  snooker: '🔴',
  straight_pool: '⚪',
};

export const DisciplineIcon = ({ discipline, color }: DisciplineIconProps) => (
  <Text style={[styles.text, color ? { color } : null]}>
    {DISCIPLINE_DISPLAY[discipline]}
  </Text>
);

const styles = StyleSheet.create({
  text: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    textAlign: 'center',
  },
});
