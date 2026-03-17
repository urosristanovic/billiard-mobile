import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import type { ApiResponse } from '@/types/api';
import type {
  Group,
  GroupMember,
  CreateGroupInput,
  UpdateGroupInput,
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

export const groupService = {
  async list(token: string): Promise<Group[]> {
    const res = await fetchWithTimeout(API_ENDPOINTS.groups.list, {
      headers: buildHeaders(token),
    });
    return parseResponse<Group[]>(res);
  },

  async create(token: string, input: CreateGroupInput): Promise<Group> {
    const res = await fetchWithTimeout(API_ENDPOINTS.groups.create, {
      method: 'POST',
      headers: jsonHeaders(token),
      body: JSON.stringify(input),
    });
    return parseResponse<Group>(res);
  },

  async getById(token: string, id: string): Promise<Group> {
    const res = await fetchWithTimeout(API_ENDPOINTS.groups.detail(id), {
      headers: buildHeaders(token),
    });
    return parseResponse<Group>(res);
  },

  async update(token: string, id: string, input: UpdateGroupInput): Promise<Group> {
    const res = await fetchWithTimeout(API_ENDPOINTS.groups.update(id), {
      method: 'PUT',
      headers: jsonHeaders(token),
      body: JSON.stringify(input),
    });
    return parseResponse<Group>(res);
  },

  async delete(token: string, id: string): Promise<void> {
    const res = await fetchWithTimeout(API_ENDPOINTS.groups.delete(id), {
      method: 'DELETE',
      headers: buildHeaders(token),
    });
    await parseResponse<null>(res);
  },

  async getMembers(token: string, id: string): Promise<GroupMember[]> {
    const res = await fetchWithTimeout(API_ENDPOINTS.groups.members(id), {
      headers: buildHeaders(token),
    });
    return parseResponse<GroupMember[]>(res);
  },

  async addMember(token: string, id: string, userId: string, role = 'member'): Promise<GroupMember> {
    const res = await fetchWithTimeout(API_ENDPOINTS.groups.addMember(id), {
      method: 'POST',
      headers: jsonHeaders(token),
      body: JSON.stringify({ userId, role }),
    });
    return parseResponse<GroupMember>(res);
  },

  async removeMember(token: string, id: string, userId: string): Promise<void> {
    const res = await fetchWithTimeout(API_ENDPOINTS.groups.removeMember(id, userId), {
      method: 'DELETE',
      headers: buildHeaders(token),
    });
    await parseResponse<null>(res);
  },
};
