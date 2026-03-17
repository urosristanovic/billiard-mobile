import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import type { ApiResponse } from '@/types/api';
import type {
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
  async list(token: string): Promise<CustomLeaderboard[]> {
    const res = await fetchWithTimeout(API_ENDPOINTS.customLeaderboards.list, {
      headers: buildHeaders(token),
    });
    return parseResponse<CustomLeaderboard[]>(res);
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

  async update(token: string, id: string, input: UpdateCustomLeaderboardInput): Promise<CustomLeaderboard> {
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
    const res = await fetchWithTimeout(API_ENDPOINTS.customLeaderboards.removeMember(id, userId), {
      method: 'DELETE',
      headers: buildHeaders(token),
    });
    await parseResponse<null>(res);
  },
};
