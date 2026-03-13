import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing, radius } from '@/constants/theme';
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
          return (
            <TouchableOpacity
              key={vis}
              onPress={() => onChange(vis)}
              activeOpacity={0.8}
              accessibilityRole='radio'
              accessibilityState={{ selected }}
              style={[
                styles.option,
                {
                  flex: 1,
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
                {t(`visibility.${vis}`)}
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
    gap: spacing[2],
  },
  option: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    alignItems: 'center',
  },
  optionText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodyMedium,
  },
});
