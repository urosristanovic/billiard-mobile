import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing } from '@/constants/theme';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
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
          return selected ? (
            <PrimaryButton
              key={format}
              label={TOURNAMENT_FORMAT_LABELS[format]}
              size='xs'
              isDark={isDark}
              onPress={() => onChange(format)}
              style={styles.pill}
            />
          ) : (
            <SecondaryButton
              key={format}
              label={TOURNAMENT_FORMAT_LABELS[format]}
              size='xs'
              isDark={isDark}
              onPress={() => onChange(format)}
              style={styles.pill}
            />
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
  pill: {
    marginBottom: 0,
  },
});
