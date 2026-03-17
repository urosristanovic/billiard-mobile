import type { Discipline } from './match';

export type ChallengeStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'cancelled'
  | 'expired';

export type Challenge = {
  id: string;
  challengerId: string;
  challengedId: string;
  challengerProfile: {
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  challengedProfile: {
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  discipline: Discipline;
  bestOf: number;
  status: ChallengeStatus;
  message: string | null;
  declinedReason: string | null;
  expiresAt: string;
  respondedAt: string | null;
  createdAt: string;
};

export type CreateChallengeInput = {
  challengedId: string;
  discipline: Discipline;
  bestOf: number;
  message?: string;
};
