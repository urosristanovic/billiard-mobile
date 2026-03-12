import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing, radius } from '@/constants/theme';

interface ConfirmationBannerProps {
  iConfirmed: boolean;
  autoConfirmAt: string | null;
  isDark: boolean;
}

export const ConfirmationBanner = ({
  iConfirmed,
  autoConfirmAt,
  isDark,
}: ConfirmationBannerProps) => {
  const { t } = useTranslation('matches');
  const tk = isDark ? theme.dark : theme.light;

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: tk.surface.raised, borderColor: tk.warning.border },
      ]}
    >
      <Text style={[styles.text, { color: tk.warning.text }]}>
        {iConfirmed ? t('youConfirmedResult') : t('waitingForOpponent')}
      </Text>
      {autoConfirmAt && (
        <Text style={[styles.sub, { color: tk.text.muted }]}>
          {t('autoConfirmsOn', {
            date: new Date(autoConfirmAt).toLocaleString(),
          })}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    padding: spacing[4],
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing[1],
  },
  text: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    fontFamily: typography.family.bodySemibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sub: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
  },
});
