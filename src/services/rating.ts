import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import type { ApiResponse } from '@/types/api';
import type { PlayerRating, RatingHistoryPoint } from '@/types/rating';
import type { Discipline } from '@/types/match';

function buildHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

async function parseResponse<T>(res: Response): Promise<T> {
  const result: ApiResponse<T> = await res.json();
  if (!res.ok) {
    throw new Error(
      result.success ? `HTTP ${res.status}: ${res.statusText}` : result.error,
    );
  }
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

export const ratingService = {
  async getByUser(token: string, userId: string): Promise<PlayerRating[]> {
    const res = await fetchWithTimeout(API_ENDPOINTS.ratings.byUser(userId), {
      headers: buildHeaders(token),
    });
    return parseResponse<PlayerRating[]>(res);
  },

  async getHistory(
    token: string,
    userId: string,
    discipline?: Discipline,
    leaderboardId?: string,
  ): Promise<RatingHistoryPoint[]> {
    const url = new URL(API_ENDPOINTS.ratings.history(userId));
    if (discipline) url.searchParams.set('discipline', discipline);
    if (leaderboardId) url.searchParams.set('leaderboardId', leaderboardId);
    const res = await fetchWithTimeout(url.toString(), {
      headers: buildHeaders(token),
    });
    return parseResponse<RatingHistoryPoint[]>(res);
  },
};
