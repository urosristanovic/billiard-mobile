import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout } from '@/components/common/layout';
import { LoadingState, EmptyState } from '@/components/common/states';
import { useConfirmDialog } from '@/components/common/dialog';
import { useQuery } from '@tanstack/react-query';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { tournamentService } from '@/services/tournament';
import { useAuth } from '@/features/auth/useAuth';
import { useTournamentMutations } from '@/features/tournaments/useTournamentMutations';
import {
  TOURNAMENT_FORMAT_LABELS,
  TOURNAMENT_STATUS_LABELS,
} from '@/types/tournament';
import { DISCIPLINE_LABELS } from '@/types/match';
import { radius, shadows, spacing, typography } from '@/constants/theme';
import type { TournamentsStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<TournamentsStackParamList, 'InvitationDetail'>;

const InvitationDetailScreen = ({ navigation, route }: Props) => {
  const { requestId } = route.params;
  const { t } = useTranslation('tournaments');
  const { t: tCommon } = useTranslation('common');
  const { isDark, tk } = useTheme();
  const { user } = useAuth();
  const { confirm } = useConfirmDialog();

  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const { data: request, isLoading } = useQuery({
    queryKey: ['tournament-request', requestId],
    queryFn: async () => {
      const token = await getAccessToken();
      const requests = await tournamentService.myPending(token);
      return requests.find(r => r.id === requestId) ?? null;
    },
    enabled: !!user && !!requestId,
  });

  const { respondToRequest } = useTournamentMutations();

  const handleRespond = (
    status: 'accepted' | 'rejected' | 'cancelled',
    reason?: string,
  ) => {
    if (!request) return;
    respondToRequest.mutate(
      {
        tournamentId: request.tournamentId,
        requestId: request.id,
        input: { status, reason: reason?.trim() || undefined },
      },
      { onSuccess: () => navigation.goBack() },
    );
  };

  const handleAcceptPress = () =>
    confirm({
      title: t('invitation.confirmAcceptTitle'),
      message: t('invitation.confirmAcceptMessage'),
      confirmLabel: t('invitation.acceptButton'),
      cancelLabel: tCommon('cancel'),
      onConfirm: () => handleRespond('accepted'),
    });

  const handleDeclineConfirm = () => {
    setShowDeclineModal(false);
    handleRespond('rejected', declineReason);
  };

  const handleCancelRequestPress = () =>
    confirm({
      title: t('invitation.confirmCancelTitle'),
      message: t('invitation.confirmCancelMessage'),
      confirmLabel: tCommon('cancel'),
      cancelLabel: tCommon('close'),
      variant: 'destructive',
      onConfirm: () => handleRespond('cancelled'),
    });

  if (isLoading) {
    return (
      <ScreenLayout isDark={isDark}>
        <LoadingState message={t('loading')} isDark={isDark} />
      </ScreenLayout>
    );
  }

  if (!request) {
    return (
      <ScreenLayout isDark={isDark}>
        <EmptyState title={t('notFound')} isDark={isDark} />
      </ScreenLayout>
    );
  }

  const isIncoming = request.direction === 'invitation';
  const tournament = request.tournament;
  const isPending = request.status === 'pending';

  return (
    <ScreenLayout isDark={isDark}>
      <View style={[styles.header, { borderBottomColor: tk.border.subtle }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole='button'
        >
          <Text style={[styles.back, { color: tk.primary[400] }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tk.text.primary }]}>
          {isIncoming ? t('invitation.title') : t('invitation.requestTitle')}
        </Text>
        <View style={styles.backPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <Text style={[styles.intro, { color: tk.text.secondary }]}>
          {isIncoming ? t('invitation.invitedTo') : t('invitation.requestedFor')}
        </Text>

        {/* Tournament card */}
        {tournament && (
          <View
            style={[
              styles.tournamentCard,
              {
                backgroundColor: tk.surface.raised,
                borderColor: tk.border.default,
              },
            ]}
          >
            <Text style={[styles.tournamentName, { color: tk.text.primary }]}>
              {tournament.name}
            </Text>
            <Text style={[styles.tournamentMeta, { color: tk.text.secondary }]}>
              {DISCIPLINE_LABELS[tournament.discipline]} ·{' '}
              {TOURNAMENT_FORMAT_LABELS[tournament.format]}
            </Text>
            <Text style={[styles.tournamentMeta, { color: tk.text.secondary }]}>
              {TOURNAMENT_STATUS_LABELS[tournament.status]} ·{' '}
              {tournament.participantCount}/{tournament.maxParticipants}{' '}
              {t('detail.participants')}
            </Text>
            {tournament.location && (
              <Text style={[styles.tournamentMeta, { color: tk.text.muted }]}>
                📍 {tournament.location}
              </Text>
            )}
            <Text style={[styles.tournamentMeta, { color: tk.text.muted }]}>
              🗓{' '}
              {new Date(tournament.scheduledAt).toLocaleString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {tournament.description ? (
              <Text style={[styles.tournamentDescription, { color: tk.text.secondary }]}>
                {tournament.description}
              </Text>
            ) : null}
          </View>
        )}

        {/* Actions */}
        {isPending && (
          <View style={styles.actionsRow}>
            {respondToRequest.isPending ? (
              <ActivityIndicator color={tk.primary[400]} style={styles.loader} />
            ) : isIncoming ? (
              <>
                {/* Decline — left, danger */}
                <TouchableOpacity
                  onPress={() => {
                    setDeclineReason('');
                    setShowDeclineModal(true);
                  }}
                  style={[
                    styles.actionBtn,
                    { backgroundColor: tk.error.dark, borderColor: tk.error.border },
                  ]}
                  accessibilityRole='button'
                >
                  <Text style={[styles.actionBtnText, { color: tk.error.text }]}>
                    {t('invitation.rejectButton')}
                  </Text>
                </TouchableOpacity>

                {/* Accept — right, primary */}
                <TouchableOpacity
                  onPress={handleAcceptPress}
                  style={[
                    styles.actionBtn,
                    { backgroundColor: tk.primary[500], borderColor: tk.primary[700] },
                  ]}
                  accessibilityRole='button'
                >
                  <Text style={[styles.actionBtnText, { color: tk.text.onPrimary }]}>
                    {t('invitation.acceptButton')}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              /* Cancel own request — full width, danger */
              <TouchableOpacity
                onPress={handleCancelRequestPress}
                style={[
                  styles.actionBtn,
                  styles.actionBtnFull,
                  { backgroundColor: tk.error.dark, borderColor: tk.error.border },
                ]}
                accessibilityRole='button'
              >
                <Text style={[styles.actionBtnText, { color: tk.error.text }]}>
                  {t('invitation.cancelButton')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Decline modal with reason input */}
      <Modal
        visible={showDeclineModal}
        transparent
        animationType='fade'
        statusBarTranslucent
        onRequestClose={() => setShowDeclineModal(false)}
      >
        <View
          style={[
            styles.modalBackdrop,
            { backgroundColor: tk.background.overlay },
          ]}
        >
          <View
            style={[
              styles.modalDialog,
              {
                backgroundColor: tk.surface.default,
                borderColor: tk.error.border,
              },
              shadows.lg,
            ]}
            accessibilityRole='alert'
          >
            <Text style={[styles.modalTitle, { color: tk.text.primary }]}>
              {t('invitation.confirmDeclineTitle')}
            </Text>
            <Text style={[styles.modalMessage, { color: tk.text.secondary }]}>
              {t('invitation.confirmDeclineMessage')}
            </Text>

            <View style={styles.reasonSection}>
              <Text style={[styles.reasonLabel, { color: tk.text.muted }]}>
                {t('invitation.reasonLabel')}
              </Text>
              <TextInput
                value={declineReason}
                onChangeText={setDeclineReason}
                placeholder={t('invitation.reasonPlaceholder')}
                placeholderTextColor={tk.text.muted}
                multiline
                numberOfLines={3}
                style={[
                  styles.reasonInput,
                  {
                    backgroundColor: tk.surface.raised,
                    borderColor: tk.border.default,
                    color: tk.text.primary,
                  },
                ]}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowDeclineModal(false)}
                style={[
                  styles.modalBtn,
                  {
                    backgroundColor: tk.surface.overlay,
                    borderColor: tk.border.default,
                  },
                ]}
              >
                <Text style={[styles.modalBtnText, { color: tk.text.secondary }]}>
                  {tCommon('cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeclineConfirm}
                style={[
                  styles.modalBtn,
                  {
                    backgroundColor: tk.error.dark,
                    borderColor: tk.error.border,
                  },
                ]}
              >
                <Text style={[styles.modalBtnText, { color: tk.error.text }]}>
                  {t('invitation.rejectButton')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    gap: spacing[2],
  },
  back: {
    fontSize: 22,
    fontFamily: typography.family.display,
    width: 32,
  },
  backPlaceholder: {
    width: 32,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.size.lg,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  content: {
    padding: spacing[4],
    gap: spacing[5],
    paddingBottom: spacing[12],
  },
  intro: {
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
    textAlign: 'center',
  },
  tournamentCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[2],
  },
  tournamentName: {
    fontSize: typography.size.lg,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  tournamentMeta: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  tournamentDescription: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    lineHeight: typography.size.sm * 1.55,
    marginTop: spacing[1],
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  loader: {
    flex: 1,
    paddingVertical: spacing[4],
  },
  actionBtn: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnFull: {
    flex: 1,
  },
  actionBtnText: {
    fontSize: typography.size.base,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  // Decline modal
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  modalDialog: {
    borderRadius: radius.xl,
    borderWidth: 2,
    padding: spacing[6],
    gap: spacing[4],
  },
  modalTitle: {
    fontSize: typography.size.xl,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  modalMessage: {
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
  },
  reasonSection: {
    gap: spacing[2],
  },
  reasonLabel: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasonInput: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[2],
  },
  modalBtn: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing[3],
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});

export default InvitationDetailScreen;
