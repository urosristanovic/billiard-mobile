import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import type { ApiResponse } from '@/types/api';
import type { LeaderboardEntry, LeaderboardParams } from '@/types/rating';

function buildHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

async function parseResponse<T>(res: Response): Promise<T> {
  const result: ApiResponse<T> = await res.json();
  if (!res.ok) {
    throw new Error(result.success ? `HTTP ${res.status}` : result.error);
  }
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export const leaderboardService = {
  async list(token: string, params: LeaderboardParams): Promise<LeaderboardEntry[]> {
    const url = new URL(API_ENDPOINTS.leaderboard.list);
    url.searchParams.set('scope', params.scope);
    url.searchParams.set('discipline', params.discipline);
    if (params.countryId) url.searchParams.set('countryId', params.countryId);
    if (params.cityId) url.searchParams.set('cityId', params.cityId);
    if (params.groupId) url.searchParams.set('groupId', params.groupId);
    if (params.leaderboardId) url.searchParams.set('leaderboardId', params.leaderboardId);
    if (params.includeProvisional) url.searchParams.set('includeProvisional', 'true');
    if (params.page) url.searchParams.set('page', String(params.page));
    if (params.pageSize) url.searchParams.set('pageSize', String(params.pageSize));

    const res = await fetchWithTimeout(url.toString(), {
      headers: buildHeaders(token),
    });
    return parseResponse<LeaderboardEntry[]>(res);
  },
};
