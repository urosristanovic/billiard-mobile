import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing, radius } from '@/constants/theme';
import { DISCIPLINES, DISCIPLINE_LABELS, type Discipline } from '@/types/match';

interface DisciplineSelectorProps {
  value: Discipline;
  onChange: (d: Discipline) => void;
  isDark: boolean;
}

export const DisciplineSelector = ({
  value,
  onChange,
  isDark,
}: DisciplineSelectorProps) => {
  const { t } = useTranslation('matches');
  const tk = isDark ? theme.dark : theme.light;

  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: tk.text.primary }]}>
        {t('create.game')}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {DISCIPLINES.map(d => {
          const active = value === d;
          return (
            <TouchableOpacity
              key={d}
              onPress={() => onChange(d)}
              accessibilityRole='button'
              accessibilityLabel={DISCIPLINE_LABELS[d]}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? tk.primary[500] : tk.surface.raised,
                  borderColor: active ? tk.primary[700] : tk.border.default,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: active ? tk.text.onPrimary : tk.primary[200] },
                ]}
              >
                {DISCIPLINE_LABELS[d]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { gap: spacing[2] },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: { gap: spacing[2], paddingVertical: spacing[1] },
  chip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  chipText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
