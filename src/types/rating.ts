import type { Discipline } from './match';

export interface PlayerRating {
  userId: string;
  discipline: Discipline;
  rating: number;
  ratingDeviation: number;
  volatility: number;
  ratedGames: number;
  wins: number;
  losses: number;
  isProvisional: boolean;
  lastUpdated: string;
}

export interface RatingHistoryPoint {
  rating: number;
  ratingDeviation: number;
  recordedAt: string;
}

export type LeaderboardScope = 'global' | 'country' | 'city' | 'group' | 'custom';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  country: string | null;
  countryCode: string | null;
  city: string | null;
  rating: number;
  ratingDeviation: number;
  ratedGames: number;
  wins: number;
  losses: number;
  isProvisional: boolean;
  ratingChange: number | null;
}

export interface LeaderboardParams {
  scope: LeaderboardScope;
  discipline: Discipline;
  countryId?: string;
  cityId?: string;
  groupId?: string;
  leaderboardId?: string;
  includeProvisional?: boolean;
  page?: number;
  pageSize?: number;
}
