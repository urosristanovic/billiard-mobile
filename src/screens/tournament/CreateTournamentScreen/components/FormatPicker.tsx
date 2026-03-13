import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing, radius } from '@/constants/theme';
import { TOURNAMENT_FORMATS, TOURNAMENT_FORMAT_LABELS } from '@/types/tournament';
import type { TournamentFormat } from '@/types/tournament';

interface FormatPickerProps {
  value: TournamentFormat;
  onChange: (format: TournamentFormat) => void;
  isDark?: boolean;
}

export const FormatPicker = ({
  value,
  onChange,
  isDark = false,
}: FormatPickerProps) => {
  const { t } = useTranslation('tournaments');
  const tk = isDark ? theme.dark : theme.light;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: tk.text.primary }]}>
        {t('create.format')} <Text style={{ color: tk.error.default }}>*</Text>
      </Text>
      <View style={styles.options}>
        {TOURNAMENT_FORMATS.map(format => {
          const selected = value === format;
          return (
            <TouchableOpacity
              key={format}
              onPress={() => onChange(format)}
              activeOpacity={0.8}
              accessibilityRole='radio'
              accessibilityState={{ selected }}
              style={[
                styles.option,
                {
                  backgroundColor: selected
                    ? tk.primary[900]
                    : tk.surface.raised,
                  borderColor: selected ? tk.primary[500] : tk.border.default,
                },
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: selected ? tk.primary[300] : tk.text.secondary },
                ]}
              >
                {TOURNAMENT_FORMAT_LABELS[format]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing[2],
  },
  label: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodySemibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  option: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  optionText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodyMedium,
  },
});
