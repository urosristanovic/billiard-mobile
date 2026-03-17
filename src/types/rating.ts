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
