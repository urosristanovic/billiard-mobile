import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import type { ApiResponse } from '@/types/api';
import type {
  BrowseLeaderboardResult,
  CustomLeaderboard,
  CreateCustomLeaderboardInput,
  UpdateCustomLeaderboardInput,
  GroupMember,
} from '@/types/group';

function buildHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

function jsonHeaders(token: string): Record<string, string> {
  return { ...buildHeaders(token), 'Content-Type': 'application/json' };
}

async function parseResponse<T>(res: Response): Promise<T> {
  const result: ApiResponse<T> = await res.json();
  if (!res.ok) {
    throw new Error(result.success ? `HTTP ${res.status}` : result.error);
  }
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export const customLeaderboardService = {
  async list(token: string, visibility?: 'public' | 'private'): Promise<CustomLeaderboard[]> {
    const url = visibility
      ? `${API_ENDPOINTS.customLeaderboards.list}?visibility=${visibility}`
      : API_ENDPOINTS.customLeaderboards.list;
    const res = await fetchWithTimeout(url, { headers: buildHeaders(token) });
    return parseResponse<CustomLeaderboard[]>(res);
  },

  async search(token: string, query?: string): Promise<BrowseLeaderboardResult[]> {
    const url = query
      ? `${API_ENDPOINTS.customLeaderboards.search}?q=${encodeURIComponent(query)}`
      : API_ENDPOINTS.customLeaderboards.search;
    const res = await fetchWithTimeout(url, { headers: buildHeaders(token) });
    return parseResponse<BrowseLeaderboardResult[]>(res);
  },

  async create(token: string, input: CreateCustomLeaderboardInput): Promise<CustomLeaderboard> {
    const res = await fetchWithTimeout(API_ENDPOINTS.customLeaderboards.create, {
      method: 'POST',
      headers: jsonHeaders(token),
      body: JSON.stringify(input),
    });
    return parseResponse<CustomLeaderboard>(res);
  },

  async getById(token: string, id: string): Promise<CustomLeaderboard> {
    const res = await fetchWithTimeout(API_ENDPOINTS.customLeaderboards.detail(id), {
      headers: buildHeaders(token),
    });
    return parseResponse<CustomLeaderboard>(res);
  },

  async update(
    token: string,
    id: string,
    input: UpdateCustomLeaderboardInput,
  ): Promise<CustomLeaderboard> {
    const res = await fetchWithTimeout(API_ENDPOINTS.customLeaderboards.update(id), {
      method: 'PUT',
      headers: jsonHeaders(token),
      body: JSON.stringify(input),
    });
    return parseResponse<CustomLeaderboard>(res);
  },

  async delete(token: string, id: string): Promise<void> {
    const res = await fetchWithTimeout(API_ENDPOINTS.customLeaderboards.delete(id), {
      method: 'DELETE',
      headers: buildHeaders(token),
    });
    await parseResponse<null>(res);
  },

  async join(token: string, id: string): Promise<{ status: string }> {
    const res = await fetchWithTimeout(API_ENDPOINTS.customLeaderboards.join(id), {
      method: 'POST',
      headers: buildHeaders(token),
    });
    return parseResponse<{ status: string }>(res);
  },

  async leave(token: string, id: string): Promise<void> {
    const res = await fetchWithTimeout(API_ENDPOINTS.customLeaderboards.leave(id), {
      method: 'POST',
      headers: buildHeaders(token),
    });
    await parseResponse<null>(res);
  },

  async getMembers(token: string, id: string): Promise<GroupMember[]> {
    const res = await fetchWithTimeout(API_ENDPOINTS.customLeaderboards.members(id), {
      headers: buildHeaders(token),
    });
    return parseResponse<GroupMember[]>(res);
  },

  async addMember(token: string, id: string, userId: string): Promise<GroupMember> {
    const res = await fetchWithTimeout(API_ENDPOINTS.customLeaderboards.addMember(id), {
      method: 'POST',
      headers: jsonHeaders(token),
      body: JSON.stringify({ userId }),
    });
    return parseResponse<GroupMember>(res);
  },

  async removeMember(token: string, id: string, userId: string): Promise<void> {
    const res = await fetchWithTimeout(
      API_ENDPOINTS.customLeaderboards.removeMember(id, userId),
      { method: 'DELETE', headers: buildHeaders(token) },
    );
    await parseResponse<null>(res);
  },

  async getPendingMembers(token: string, id: string): Promise<GroupMember[]> {
    const res = await fetchWithTimeout(API_ENDPOINTS.customLeaderboards.pending(id), {
      headers: buildHeaders(token),
    });
    return parseResponse<GroupMember[]>(res);
  },

  async respondToPending(
    token: string,
    leaderboardId: string,
    userId: string,
    action: 'accept' | 'decline',
  ): Promise<void> {
    const res = await fetchWithTimeout(
      API_ENDPOINTS.customLeaderboards.respondToPending(leaderboardId, userId),
      {
        method: 'PATCH',
        headers: jsonHeaders(token),
        body: JSON.stringify({ action }),
      },
    );
    await parseResponse<null>(res);
  },
};
