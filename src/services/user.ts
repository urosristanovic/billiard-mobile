import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import type { ApiResponse } from '@/types/api';

export interface UserSearchResult {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  location: string | null;
}

export const userService = {
  search: async (
    token: string,
    query: string,
    excludeId?: string,
  ): Promise<UserSearchResult[]> => {
    if (!query.trim()) return [];

    const url = new URL(API_ENDPOINTS.users.search);
    url.searchParams.set('q', query.trim());
    if (excludeId) {
      url.searchParams.set('excludeId', excludeId);
    }

    const res = await fetchWithTimeout(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result: ApiResponse<UserSearchResult[]> = await res.json();
    if (!res.ok) {
      throw new Error(
        result.success ? `HTTP ${res.status}: ${res.statusText}` : result.error,
      );
    }
    if (!result.success) {
      throw new Error(result.error);
    }

    return result.data;
  },
};
