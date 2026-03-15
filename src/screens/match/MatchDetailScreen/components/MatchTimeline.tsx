import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Match } from '@/types/match';
import { theme, typography, spacing, radius } from '@/constants/theme';
import { buildMatchTimeline, type TimelineEvent } from '../buildMatchTimeline';

interface MatchTimelineProps {
  match: Match;
  myUserId: string;
  isDark: boolean;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

function eventLabel(
  t: (key: string, options?: Record<string, unknown>) => string,
  event: TimelineEvent,
) {
  switch (event.type) {
    case 'matchCreated':
      if (event.isTournament) {
        return event.tournamentName
          ? t('timeline.matchCreatedTournamentNamed', {
              name: event.tournamentName,
            })
          : t('timeline.matchCreatedTournament');
      }
      return t('timeline.matchCreated', { name: event.actorName });
    case 'resultAccepted':
      return t('timeline.resultAccepted', { name: event.actorName });
    case 'cancellationRequested':
      return t('timeline.cancellationRequested', { name: event.actorName });
    case 'cancellationAccepted':
      return t('timeline.cancellationAccepted', { name: event.actorName });
    case 'disputeOpened':
      return t('timeline.disputeOpened', { name: event.actorName });
    case 'counterDispute':
      return t('timeline.counterDispute', { name: event.actorName });
    case 'disputeAccepted':
      return t('timeline.disputeAccepted', { name: event.actorName });
    case 'matchCancelled':
      return t('timeline.matchCancelled', { name: event.actorName });
    default:
      return '';
  }
}

export const MatchTimeline = ({
  match,
  myUserId,
  isDark,
}: MatchTimelineProps) => {
  const { t } = useTranslation('matches');
  const tk = isDark ? theme.dark : theme.light;
  const timeline = buildMatchTimeline(
    match,
    myUserId,
    t('detail.unknownPlayer'),
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: tk.surface.raised, borderColor: tk.border.default },
      ]}
    >
      <Text style={[styles.title, { color: tk.text.primary }]}>
        {t('timeline.title')}
      </Text>

      {timeline.length === 0 ? (
        <Text style={[styles.emptyText, { color: tk.text.muted }]}>
          {t('timeline.empty')}
        </Text>
      ) : (
        timeline.map((event, index) => (
          <View
            key={event.id}
            style={[
              styles.item,
              index > 0 && {
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: tk.border.subtle,
                paddingTop: spacing[3],
              },
            ]}
          >
            <Text style={[styles.itemTitle, { color: tk.text.primary }]}>
              {eventLabel(t, event)}
            </Text>
            <Text style={[styles.itemMeta, { color: tk.text.muted }]}>
              {formatDateTime(event.at)}
            </Text>
            {event.reason ? (
              <Text style={[styles.itemMeta, { color: tk.text.secondary }]}>
                {t('timeline.reason', { reason: event.reason })}
              </Text>
            ) : null}
            {typeof event.myScore === 'number' &&
            typeof event.opponentScore === 'number' ? (
              <Text style={[styles.itemMeta, { color: tk.text.secondary }]}>
                {t('you')}: {event.myScore} | {event.opponentName}:{' '}
                {event.opponentScore}
              </Text>
            ) : null}
          </View>
        ))
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
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodyMedium,
  },
  item: {
    gap: spacing[1],
  },
  itemTitle: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodySemibold,
  },
  itemMeta: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bodyMedium,
  },
});
