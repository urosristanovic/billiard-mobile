import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useConfirmDialog } from '@/components/common/dialog';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import type { Tournament } from '@/types/tournament';
import { styles } from '../styles';

const btnStyle = { shadowOpacity: 0, elevation: 0, flex: 1 } as const;

interface MutationState {
  isPending: boolean;
}

interface OrganizerActionsProps {
  tournament: Tournament;
  publishMutation: MutationState & { mutate: (id: string) => void };
  startMutation: MutationState & { mutate: (id: string) => void };
  completeMutation: MutationState & { mutate: (id: string) => void };
  onEdit: () => void;
  onInvite: () => void;
}

export const OrganizerActions = ({
  tournament,
  publishMutation,
  startMutation,
  completeMutation,
  onEdit,
  onInvite,
}: OrganizerActionsProps) => {
  const { t } = useTranslation('tournaments');
  const { t: tCommon } = useTranslation('common');
  const { isDark, tk } = useTheme();
  const { confirm } = useConfirmDialog();

  const canStartTournament =
    tournament.participants.length === tournament.maxParticipants;

  const allMatchesFinished = tournament.matches
    .filter(m => m.homeUserId !== null && m.awayUserId !== null)
    .every(m => m.winnerId !== null);

  return (
    <View style={styles.actionsWrapper}>
      <View style={styles.actions}>
        {tournament.status === 'draft' && (
          <PrimaryButton
            label={t('detail.actions.publish')}
            loading={publishMutation.isPending}
            compact
            isDark={isDark}
            style={btnStyle}
            onPress={() =>
              confirm({
                title: t('detail.confirmPublish'),
                message: t('detail.confirmPublishMessage'),
                confirmLabel: t('detail.actions.publish'),
                cancelLabel: tCommon('cancel'),
                onConfirm: () => publishMutation.mutate(tournament.id),
              })
            }
          />
        )}

        {tournament.status === 'registration' && canStartTournament && (
          <PrimaryButton
            label={t('detail.actions.start')}
            loading={startMutation.isPending}
            compact
            isDark={isDark}
            style={btnStyle}
            onPress={() =>
              confirm({
                title: t('detail.confirmStart'),
                message: t('detail.confirmStartMessage'),
                confirmLabel: t('detail.actions.start'),
                cancelLabel: tCommon('cancel'),
                onConfirm: () => startMutation.mutate(tournament.id),
              })
            }
          />
        )}

        {(tournament.status === 'pending_review' ||
          (tournament.status === 'in_progress' && allMatchesFinished)) && (
          <PrimaryButton
            label={t('detail.actions.complete')}
            loading={completeMutation.isPending}
            compact
            isDark={isDark}
            style={btnStyle}
            onPress={() =>
              confirm({
                title: t('detail.confirmComplete'),
                message: t('detail.confirmCompleteMessage'),
                confirmLabel: 'Complete',
                cancelLabel: tCommon('close'),
                onConfirm: () => completeMutation.mutate(tournament.id),
              })
            }
          />
        )}

        {['draft', 'registration'].includes(tournament.status) && (
          <SecondaryButton
            label={t('detail.actions.edit')}
            compact
            isDark={isDark}
            style={btnStyle}
            onPress={onEdit}
          />
        )}

        {['draft', 'registration'].includes(tournament.status) && (
          <PrimaryButton
            label={t('detail.actions.addParticipants')}
            disabled={tournament.status === 'draft'}
            compact
            isDark={isDark}
            style={btnStyle}
            onPress={onInvite}
            icon={<Feather name='plus' size={16} color={tk.text.onPrimary} />}
          />
        )}
      </View>

      {tournament.status === 'registration' && !canStartTournament && (
        <Text style={[styles.startHint, { color: tk.text.muted }]}>
          {t('detail.startRequiresFullRoster', {
            count: tournament.participants.length,
            max: tournament.maxParticipants,
          })}
        </Text>
      )}
      {tournament.status === 'draft' && (
        <Text style={[styles.startHint, { color: tk.text.muted }]}>
          {t('detail.publishToAddParticipants')}
        </Text>
      )}
    </View>
  );
};
