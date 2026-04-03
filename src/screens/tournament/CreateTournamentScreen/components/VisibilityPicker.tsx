import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing } from '@/constants/theme';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import type { TournamentVisibility } from '@/types/tournament';

const VISIBILITY_OPTIONS: TournamentVisibility[] = ['public', 'invite_only'];

interface VisibilityPickerProps {
  value: TournamentVisibility;
  onChange: (v: TournamentVisibility) => void;
  isDark?: boolean;
}

export const VisibilityPicker = ({
  value,
  onChange,
  isDark = false,
}: VisibilityPickerProps) => {
  const { t } = useTranslation('tournaments');
  const tk = isDark ? theme.dark : theme.light;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: tk.text.primary }]}>
        {t('create.visibility')} <Text style={{ color: tk.error.default }}>*</Text>
      </Text>
      <View style={styles.options}>
        {VISIBILITY_OPTIONS.map(vis => {
          const selected = value === vis;
          return selected ? (
            <PrimaryButton
              key={vis}
              label={t(`visibility.${vis}`)}
              size='xs'
              isDark={isDark}
              onPress={() => onChange(vis)}
              style={styles.pill}
            />
          ) : (
            <SecondaryButton
              key={vis}
              label={t(`visibility.${vis}`)}
              size='xs'
              isDark={isDark}
              onPress={() => onChange(vis)}
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
    gap: spacing[2],
  },
  pill: {
    flex: 1,
  },
});
