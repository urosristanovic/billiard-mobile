import type { Discipline } from './match';

export type TournamentFormat =
  | 'single_elimination'
  | 'double_elimination'
  | 'round_robin';

export type TournamentStatus =
  | 'draft'
  | 'registration'
  | 'in_progress'
  | 'pending_review'
  | 'completed'
  | 'cancelled';

export type TournamentVisibility = 'public' | 'invite_only';

export type TournamentRequestDirection = 'invitation' | 'request';

export type TournamentRequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'cancelled';

export type TournamentRoundBracketType =
  | 'winners'
  | 'losers'
  | 'grand_final'
  | 'main';

export type TournamentRoundStatus = 'pending' | 'in_progress' | 'completed';

export interface TournamentParticipantProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface TournamentParticipant {
  id: string;
  tournamentId: string;
  userId: string;
  seed: number | null;
  joinedAt: string;
  profile: TournamentParticipantProfile;
}

export interface TournamentRound {
  id: string;
  tournamentId: string;
  roundNumber: number;
  bracketType: TournamentRoundBracketType;
  status: TournamentRoundStatus;
}

export interface TournamentMatch {
  id: string;
  tournamentId: string;
  roundId: string;
  matchId: string | null;
  homeUserId: string | null;
  awayUserId: string | null;
  homeScore: number | null;
  awayScore: number | null;
  winnerId: string | null;
  position: number;
  nextMatchId: string | null;
  nextLoserMatchId: string | null;
  homeProfile: TournamentParticipantProfile | null;
  awayProfile: TournamentParticipantProfile | null;
  canRecord?: boolean;
  canEdit?: boolean;
}

export interface NextMatchInfo {
  tournamentMatchId: string;
  opponentId: string | null;
  opponentProfile: TournamentParticipantProfile | null;
  scheduledAt: string | null;
  state: 'scheduled' | 'waiting_opponent' | 'eliminated' | 'none';
}

export interface TournamentRequest {
  id: string;
  tournamentId: string;
  userId: string;
  direction: TournamentRequestDirection;
  status: TournamentRequestStatus;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
  profile: TournamentParticipantProfile;
  tournament?: TournamentSummary;
}

export interface TournamentSummary {
  id: string;
  name: string;
  description: string | null;
  discipline: Discipline;
  format: TournamentFormat;
  status: TournamentStatus;
  visibility: TournamentVisibility;
  organizerId: string;
  organizerProfile: TournamentParticipantProfile;
  maxParticipants: number;
  participantCount: number;
  scheduledAt: string;
  location: string | null;
  createdAt: string;
  updatedAt: string;
  isRated: boolean;
  nextMatchInfo?: NextMatchInfo | null;
  didWin?: boolean;
}

export interface Tournament extends TournamentSummary {
  participants: TournamentParticipant[];
  rounds: TournamentRound[];
  matches: TournamentMatch[];
}

export interface StandingsRow {
  userId: string;
  displayName: string;
  played: number;
  wins: number;
  losses: number;
  points: number;
  scored: number;
  conceded: number;
}

export interface TournamentStats {
  active: number;
  won: number;
}

export interface CreateTournamentInput {
  name: string;
  description?: string;
  discipline: Discipline;
  format: TournamentFormat;
  visibility: TournamentVisibility;
  maxParticipants: number;
  scheduledAt: string;
  location?: string;
  isRated?: boolean;
}

export interface UpdateTournamentInput {
  name?: string;
  description?: string;
  discipline?: Discipline;
  format?: TournamentFormat;
  visibility?: TournamentVisibility;
  maxParticipants?: number;
  scheduledAt?: string;
  location?: string;
  isRated?: boolean;
}

export interface TournamentListParams {
  discipline?: Discipline;
  status?: TournamentStatus;
  visibility?: TournamentVisibility;
  page?: number;
  pageSize?: number;
}

export interface RespondToRequestInput {
  status: 'accepted' | 'rejected' | 'cancelled';
  reason?: string;
}

export interface ReportResultInput {
  homeScore: number;
  awayScore: number;
}

export const TOURNAMENT_FORMAT_LABELS: Record<TournamentFormat, string> = {
  single_elimination: 'Single',
  double_elimination: 'Double',
  round_robin: 'Round Robin',
};

export const TOURNAMENT_FORMATS: TournamentFormat[] = [
  'single_elimination',
  'double_elimination',
  'round_robin',
];

export const TOURNAMENT_STATUSES: TournamentStatus[] = [
  'draft',
  'registration',
  'in_progress',
  'pending_review',
  'completed',
  'cancelled',
];

export const TOURNAMENT_VISIBILITY_LABELS: Record<
  TournamentVisibility,
  string
> = {
  public: 'Public',
  invite_only: 'Invite Only',
};
