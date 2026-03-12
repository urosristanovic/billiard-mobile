import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  PrimaryButton,
  SecondaryButton,
} from '@/components/common/buttons';
import { theme, typography, spacing, radius } from '@/constants/theme';

interface DisputeResolutionProps {
  reason: string | null;
  proposedMyScore: number | null;
  proposedOpponentScore: number | null;
  currentMyScore: number | null;
  currentOpponentScore: number | null;
  opponentName: string;
  canResolve: boolean;
  isAccepting: boolean;
  isDark: boolean;
  onAccept: () => void;
}

export const DisputeResolution = ({
  reason,
  proposedMyScore,
  proposedOpponentScore,
  currentMyScore,
  currentOpponentScore,
  opponentName,
  canResolve,
  isAccepting,
  isDark,
  onAccept,
}: DisputeResolutionProps) => {
  const { t } = useTranslation('matches');
  const tk = isDark ? theme.dark : theme.light;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: tk.surface.raised, borderColor: tk.warning.border },
      ]}
    >
      <Text style={[styles.title, { color: tk.warning.text }]}>
        {t('detail.disputeResolutionTitle')}
      </Text>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: tk.text.muted }]}>
          {t('detail.disputeReasonLabel')}
        </Text>
        <Text style={[styles.value, { color: tk.text.primary }]}>
          {reason || t('detail.disputeReasonEmpty')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: tk.text.muted }]}>
          {t('detail.currentScoresLabel')}
        </Text>
        <Text style={[styles.value, { color: tk.text.primary }]}>
          {t('you')}: {currentMyScore ?? '-'} | {opponentName}:{' '}
          {currentOpponentScore ?? '-'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: tk.text.muted }]}>
          {t('detail.proposedScoresLabel')}
        </Text>
        <Text style={[styles.value, { color: tk.text.primary }]}>
          {t('you')}: {proposedMyScore ?? '-'} | {opponentName}:{' '}
          {proposedOpponentScore ?? '-'}
        </Text>
      </View>

      {canResolve ? (
        <View style={styles.actions}>
          <PrimaryButton
            label={t('detail.acceptCorrectionButton')}
            onPress={onAccept}
            loading={isAccepting}
            isDark={isDark}
          />
        </View>
      ) : (
        <SecondaryButton
          label={t('detail.awaitingResolutionButton')}
          disabled
          isDark={isDark}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[3],
  },
  title: {
    fontSize: typography.size.base,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    gap: spacing[1],
  },
  sectionLabel: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodyMedium,
  },
  actions: {
    gap: spacing[2],
  },
});
