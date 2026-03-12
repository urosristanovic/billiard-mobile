import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing, radius } from '@/constants/theme';
import type { UserSearchResult } from '@/services/user';

interface OpponentFieldProps {
  opponent: UserSearchResult | null;
  error?: string;
  onPress: () => void;
  isDark: boolean;
}

export const OpponentField = ({
  opponent,
  error,
  onPress,
  isDark,
}: OpponentFieldProps) => {
  const { t } = useTranslation('matches');
  const tk = isDark ? theme.dark : theme.light;

  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: tk.text.primary }]}>
        {t('create.opponent')}
      </Text>
      <TouchableOpacity
        onPress={onPress}
        accessibilityRole='button'
        accessibilityLabel={t('selectOpponent')}
        style={[
          styles.button,
          {
            backgroundColor: tk.surface.raised,
            borderColor: error
              ? tk.error.default
              : opponent
                ? tk.primary[700]
                : tk.border.default,
          },
        ]}
      >
        {opponent ? (
          <View style={styles.selected}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: tk.background.secondary,
                  borderColor: tk.primary[600],
                },
              ]}
            >
              <Text style={[styles.avatarText, { color: tk.primary[300] }]}>
                {opponent.displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.name, { color: tk.text.primary }]}>
              {opponent.displayName}
              <Text style={{ color: tk.text.muted }}>
                {' '}
                @{opponent.username}
              </Text>
            </Text>
          </View>
        ) : (
          <Text style={[styles.placeholder, { color: tk.text.muted }]}>
            {t('create.opponentPlaceholder')}
          </Text>
        )}
      </TouchableOpacity>
      {error && (
        <Text style={[styles.error, { color: tk.error.default }]}>{error}</Text>
      )}
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
  button: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    justifyContent: 'center',
  },
  selected: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  avatarText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.heading,
  },
  name: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    fontFamily: typography.family.bodySemibold,
  },
  placeholder: {
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
  },
  error: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bodyMedium,
  },
});
