import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing, radius } from '@/constants/theme';

interface ConfirmationBannerProps {
  status: 'pending_confirmation' | 'disputed';
  iConfirmed: boolean;
  iAmDisputer: boolean;
  autoConfirmAt: string | null;
  isDark: boolean;
}

export const ConfirmationBanner = ({
  status,
  iConfirmed,
  iAmDisputer,
  autoConfirmAt,
  isDark,
}: ConfirmationBannerProps) => {
  const { t } = useTranslation('matches');
  const tk = isDark ? theme.dark : theme.light;

  const dateString = autoConfirmAt
    ? new Date(autoConfirmAt).toLocaleString()
    : null;

  let mainText: string;
  let subText: string | null = null;

  if (status === 'disputed') {
    if (iAmDisputer) {
      mainText = t('disputeYouDisputed');
      subText = dateString ? t('autoResolvesOn', { date: dateString }) : null;
    } else {
      mainText = t('disputeOpponentDisputed');
      subText = dateString ? t('autoResolvesOn', { date: dateString }) : null;
    }
  } else {
    mainText = iConfirmed ? t('youSubmittedScores') : t('opponentSubmittedScores');
    subText = dateString ? t('autoConfirmsOn', { date: dateString }) : null;
  }

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: tk.surface.raised, borderColor: tk.warning.border },
      ]}
    >
      <Text style={[styles.text, { color: tk.warning.text }]}>
        {mainText}
      </Text>
      {subText && (
        <Text style={[styles.sub, { color: tk.text.muted }]}>
          {subText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    padding: spacing[4],
    borderRadius: radius['2xl'],
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
