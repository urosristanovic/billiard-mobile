export type Discipline =
  | '8ball'
  | '9ball'
  | '10ball'
  | 'straight_pool'
  | 'snooker';

export type MatchStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'disputed'
  | 'cancelled';

export interface MatchPlayerProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface MatchPlayer {
  id: string;
  matchId: string;
  userId: string;
  score: number | null;
  isWinner: boolean;
  confirmed: boolean;
  confirmedAt?: string | null;
  cancelRequested: boolean;
  cancelRequestedAt?: string | null;
  profile: MatchPlayerProfile;
}

export type MatchDisputeStatus = 'open' | 'accepted' | 'rejected';

export interface MatchDispute {
  id: string;
  matchId: string;
  disputedBy: string;
  reason: string | null;
  originalScores: Record<string, number> | null;
  proposedScores: Record<string, number>;
  status: MatchDisputeStatus;
  resolvedAt: string | null;
  createdAt: string;
}

export interface Match {
  id: string;
  discipline: Discipline;
  isRated: boolean;
  isTournament: boolean;
  createdBy: string | null;
  status: MatchStatus;
  winnerId: string | null;
  autoConfirmAt: string | null;
  confirmedAt: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancellationReason: string | null;
  playedAt: string;
  createdAt: string;
  updatedAt: string;
  players: MatchPlayer[];
  dispute: MatchDispute | null;
  disputes: MatchDispute[];
}

export interface CreateMatchInput {
  discipline: Discipline;
  opponentId: string;
  myScore: number | null;
  opponentScore: number | null;
  isRated: boolean;
  isTournament: boolean;
  playedAt?: string;
}

export interface DisputeMatchInput {
  reason?: string;
  proposedScores: Record<string, number>;
}

export interface MatchListParams {
  discipline?: Discipline;
  status?: MatchStatus;
  opponentId?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export interface MatchStats {
  played: number;
  wins: number;
  winRate: number;
  winStreak: number;
}

export interface MatchOpponent {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export const DISCIPLINE_LABELS: Record<Discipline, string> = {
  '8ball': '8-Ball',
  '9ball': '9-Ball',
  '10ball': '10-Ball',
  straight_pool: 'Straight Pool',
  snooker: 'Snooker',
};

export const DISCIPLINES: Discipline[] = [
  '8ball',
  '9ball',
  '10ball',
  'snooker',
  'straight_pool',
];

export const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  pending_confirmation: 'Pending',
  confirmed: 'Confirmed',
  disputed: 'Disputed',
  cancelled: 'Cancelled',
};
