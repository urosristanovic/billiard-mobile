import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { useConfirmDialog } from '@/components/common/dialog';
import type { Tournament } from '@/types/tournament';
import { styles } from '../styles';

interface MutationState {
  isPending: boolean;
}

interface OrganizerActionsProps {
  tournament: Tournament;
  publishMutation: MutationState & { mutate: (id: string) => void };
  startMutation: MutationState & { mutate: (id: string) => void };
  completeMutation: MutationState & { mutate: (id: string) => void };
  cancelMutation: MutationState & { mutate: (id: string) => void };
  onEdit: () => void;
  onInvite: () => void;
}

export const OrganizerActions = ({
  tournament,
  publishMutation,
  startMutation,
  completeMutation,
  cancelMutation,
  onEdit,
  onInvite,
}: OrganizerActionsProps) => {
  const { t } = useTranslation('tournaments');
  const { t: tCommon } = useTranslation('common');
  const { tk } = useTheme();
  const { confirm } = useConfirmDialog();

  const canStartTournament =
    tournament.participants.length === tournament.maxParticipants;

  return (
    <View style={styles.actionsWrapper}>
      <View style={styles.actions}>
        {tournament.status === 'draft' && (
          <>
            <TouchableOpacity
              onPress={() =>
                confirm({
                  title: t('detail.confirmPublish'),
                  message: t('detail.confirmPublishMessage'),
                  confirmLabel: t('detail.actions.publish'),
                  cancelLabel: tCommon('cancel'),
                  onConfirm: () => publishMutation.mutate(tournament.id),
                })
              }
              disabled={publishMutation.isPending}
              style={[
                styles.actionBtn,
                styles.actionBtnPrimary,
                {
                  backgroundColor: tk.primary[500],
                  borderColor: tk.primary[700],
                },
              ]}
            >
              {publishMutation.isPending ? (
                <ActivityIndicator size='small' color={tk.text.onPrimary} />
              ) : (
                <Text
                  style={[styles.actionBtnText, { color: tk.text.onPrimary }]}
                >
                  {t('detail.actions.publish')}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onEdit}
              style={[
                styles.actionBtn,
                {
                  borderColor: tk.primary[600],
                  backgroundColor: tk.surface.overlay,
                },
              ]}
            >
              <Text style={[styles.actionBtnText, { color: tk.primary[400] }]}>
                {t('detail.actions.edit')}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {tournament.status === 'registration' && (
          <>
            <TouchableOpacity
              onPress={() =>
                confirm({
                  title: t('detail.confirmStart'),
                  message: t('detail.confirmStartMessage'),
                  confirmLabel: t('detail.actions.start'),
                  cancelLabel: tCommon('cancel'),
                  onConfirm: () => startMutation.mutate(tournament.id),
                })
              }
              disabled={startMutation.isPending || !canStartTournament}
              style={[
                styles.actionBtn,
                styles.actionBtnPrimary,
                {
                  backgroundColor: canStartTournament
                    ? tk.primary[500]
                    : tk.surface.overlay,
                  borderColor: canStartTournament
                    ? tk.primary[700]
                    : tk.border.default,
                },
              ]}
            >
              {startMutation.isPending ? (
                <ActivityIndicator size='small' color={tk.text.onPrimary} />
              ) : (
                <Text
                  style={[
                    styles.actionBtnText,
                    {
                      color: canStartTournament
                        ? tk.text.onPrimary
                        : tk.text.muted,
                    },
                  ]}
                >
                  {t('detail.actions.start')}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onEdit}
              style={[
                styles.actionBtn,
                {
                  borderColor: tk.primary[600],
                  backgroundColor: tk.surface.overlay,
                },
              ]}
            >
              <Text style={[styles.actionBtnText, { color: tk.primary[400] }]}>
                {t('detail.actions.edit')}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {['in_progress', 'pending_review'].includes(tournament.status) && (
          <TouchableOpacity
            onPress={() =>
              confirm({
                title: t('detail.confirmComplete'),
                message: t('detail.confirmCompleteMessage'),
                confirmLabel: 'Complete',
                cancelLabel: tCommon('close'),
                onConfirm: () => completeMutation.mutate(tournament.id),
              })
            }
            disabled={completeMutation.isPending}
            style={[
              styles.actionBtn,
              styles.actionBtnPrimary,
              {
                backgroundColor: tk.primary[500],
                borderColor: tk.primary[700],
              },
            ]}
          >
            {completeMutation.isPending ? (
              <ActivityIndicator size='small' color={tk.text.onPrimary} />
            ) : (
              <Text
                style={[styles.actionBtnText, { color: tk.text.onPrimary }]}
              >
                {t('detail.actions.complete')}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {!['completed', 'cancelled'].includes(tournament.status) && (
          <TouchableOpacity
            onPress={() =>
              confirm({
                title: t('detail.confirmCancel'),
                message: t('detail.confirmCancelMessage'),
                confirmLabel: t('detail.actions.cancel'),
                cancelLabel: tCommon('close'),
                variant: 'destructive',
                onConfirm: () => cancelMutation.mutate(tournament.id),
              })
            }
            style={[
              styles.actionBtn,
              {
                borderColor: tk.error.border,
                backgroundColor: tk.error.dark,
              },
            ]}
          >
            <Text style={[styles.actionBtnText, { color: tk.error.text }]}>
              {t('detail.actions.cancel')}
            </Text>
          </TouchableOpacity>
        )}

        {['draft', 'registration'].includes(tournament.status) && (
          <TouchableOpacity
            onPress={onInvite}
            disabled={tournament.status === 'draft'}
            style={[
              styles.actionBtn,
              {
                borderColor:
                  tournament.status === 'draft'
                    ? tk.border.default
                    : tk.primary[600],
                backgroundColor: tk.surface.overlay,
              },
            ]}
          >
            <Text
              style={[
                styles.actionBtnText,
                {
                  color:
                    tournament.status === 'draft'
                      ? tk.text.muted
                      : tk.primary[400],
                },
              ]}
            >
              {t('detail.actions.addParticipants')}
            </Text>
          </TouchableOpacity>
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
