import type { Match, MatchDispute, MatchPlayer } from '@/types/match';

export type TimelineEventType =
  | 'matchCreated'
  | 'resultAccepted'
  | 'cancellationRequested'
  | 'cancellationAccepted'
  | 'disputeOpened'
  | 'counterDispute'
  | 'disputeAccepted'
  | 'matchCancelled';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  at: string;
  actorName: string;
  reason?: string | null;
  myScore?: number | null;
  opponentScore?: number | null;
  opponentName?: string;
}

function isValidTimestamp(value: string | null | undefined): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function getDisplayName(
  player: MatchPlayer | null | undefined,
  myUserId: string,
  fallback: string,
) {
  if (!player) return fallback;
  return player.userId === myUserId
    ? 'you'
    : player.profile.displayName || fallback;
}

function getCreator(match: Match): MatchPlayer | null {
  if (match.createdBy) {
    return (
      match.players.find(player => player.userId === match.createdBy) ?? null
    );
  }

  const [earliestConfirmed] = [...match.players]
    .filter(player => isValidTimestamp(player.confirmedAt))
    .sort(
      (a, b) =>
        Date.parse(a.confirmedAt as string) -
        Date.parse(b.confirmedAt as string),
    );
  return earliestConfirmed ?? null;
}

function addDisputeEvents(
  events: TimelineEvent[],
  disputes: MatchDispute[],
  players: MatchPlayer[],
  myUserId: string,
  unknownPlayerLabel: string,
) {
  const disputesAsc = [...disputes].sort(
    (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
  );

  disputesAsc.forEach((dispute, index) => {
    if (!isValidTimestamp(dispute.createdAt)) return;
    const disputer =
      players.find(player => player.userId === dispute.disputedBy) ?? null;
    const nonDisputer =
      players.find(player => player.userId !== dispute.disputedBy) ?? null;
    const viewerOpponent =
      players.find(player => player.userId !== myUserId) ?? null;
    const previousDispute = index > 0 ? disputesAsc[index - 1] : null;
    const isCounter = previousDispute?.status === 'rejected';

    events.push({
      id: `dispute-${dispute.id}`,
      type: isCounter ? 'counterDispute' : 'disputeOpened',
      at: dispute.createdAt,
      actorName: getDisplayName(disputer, myUserId, unknownPlayerLabel),
      reason: dispute.reason,
      myScore:
        typeof dispute.proposedScores[myUserId] === 'number'
          ? dispute.proposedScores[myUserId]
          : null,
      opponentScore:
        viewerOpponent &&
        typeof dispute.proposedScores[viewerOpponent.userId] === 'number'
          ? dispute.proposedScores[viewerOpponent.userId]
          : null,
      opponentName: viewerOpponent?.profile.displayName ?? unknownPlayerLabel,
    });

    if (dispute.status === 'accepted' && isValidTimestamp(dispute.resolvedAt)) {
      events.push({
        id: `dispute-accepted-${dispute.id}`,
        type: 'disputeAccepted',
        at: dispute.resolvedAt,
        actorName: getDisplayName(nonDisputer, myUserId, unknownPlayerLabel),
      });
    }
  });
}

export function buildMatchTimeline(
  match: Match,
  myUserId: string,
  unknownPlayerLabel: string,
): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const creator = getCreator(match);
  const creatorName = getDisplayName(creator, myUserId, unknownPlayerLabel);

  if (isValidTimestamp(match.createdAt)) {
    events.push({
      id: `created-${match.id}`,
      type: 'matchCreated',
      at: match.createdAt,
      actorName: creatorName,
    });
  }

  const acceptor =
    match.players.find(
      player =>
        player.userId !== creator?.userId &&
        isValidTimestamp(player.confirmedAt) &&
        player.confirmed,
    ) ?? null;
  if (acceptor?.confirmedAt) {
    events.push({
      id: `accepted-${acceptor.userId}`,
      type: 'resultAccepted',
      at: acceptor.confirmedAt,
      actorName: getDisplayName(acceptor, myUserId, unknownPlayerLabel),
    });
  }

  const cancelActors = [...match.players]
    .filter(player => isValidTimestamp(player.cancelRequestedAt))
    .sort(
      (a, b) =>
        Date.parse(a.cancelRequestedAt as string) -
        Date.parse(b.cancelRequestedAt as string),
    );
  const firstCancel = cancelActors[0];
  const secondCancel = cancelActors[1];

  if (firstCancel?.cancelRequestedAt) {
    events.push({
      id: `cancel-request-${firstCancel.userId}`,
      type: 'cancellationRequested',
      at: firstCancel.cancelRequestedAt,
      actorName: getDisplayName(firstCancel, myUserId, unknownPlayerLabel),
      reason: match.cancellationReason,
    });
  }
  if (secondCancel?.cancelRequestedAt) {
    events.push({
      id: `cancel-accept-${secondCancel.userId}`,
      type: 'cancellationAccepted',
      at: secondCancel.cancelRequestedAt,
      actorName: getDisplayName(secondCancel, myUserId, unknownPlayerLabel),
    });
  }

  addDisputeEvents(
    events,
    match.disputes,
    match.players,
    myUserId,
    unknownPlayerLabel,
  );

  const cancelledByPlayer =
    match.players.find(player => player.userId === match.cancelledBy) ?? null;
  if (isValidTimestamp(match.cancelledAt)) {
    events.push({
      id: `cancelled-${match.id}`,
      type: 'matchCancelled',
      at: match.cancelledAt,
      actorName: getDisplayName(
        cancelledByPlayer,
        myUserId,
        unknownPlayerLabel,
      ),
      reason: match.cancellationReason,
    });
  }

  return events.sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
}
