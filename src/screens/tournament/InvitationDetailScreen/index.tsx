import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { LoadingState, EmptyState } from '@/components/common/states';
import { useConfirmDialog } from '@/components/common/dialog';
import { useQuery } from '@tanstack/react-query';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { tournamentService } from '@/services/tournament';
import { useAuth } from '@/features/auth/useAuth';
import { useTournamentMutations } from '@/features/tournaments/useTournamentMutations';
import type { TournamentsStackParamList } from '@/navigation/AppNavigator';
import { TournamentSummaryCard } from './components/TournamentSummaryCard';
import { InvitationActions } from './components/InvitationActions';
import { styles } from './styles';

type Props = NativeStackScreenProps<TournamentsStackParamList, 'InvitationDetail'>;

const InvitationDetailScreen = ({ navigation, route }: Props) => {
  const { requestId } = route.params;
  const { t } = useTranslation('tournaments');
  const { t: tCommon } = useTranslation('common');
  const { isDark, tk } = useTheme();
  const { user } = useAuth();
  const { confirm } = useConfirmDialog();

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
      <ScreenHeader
        title={isIncoming ? t('invitation.title') : t('invitation.requestTitle')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.intro, { color: tk.text.secondary }]}>
          {isIncoming ? t('invitation.invitedTo') : t('invitation.requestedFor')}
        </Text>

        {tournament && <TournamentSummaryCard tournament={tournament} />}

        {isPending && (
          <InvitationActions
            isIncoming={isIncoming}
            isSubmitting={respondToRequest.isPending}
            onAccept={handleAcceptPress}
            onDecline={reason => handleRespond('rejected', reason)}
            onCancel={handleCancelRequestPress}
          />
        )}
      </ScrollView>
    </ScreenLayout>
  );
};

export default InvitationDetailScreen;
