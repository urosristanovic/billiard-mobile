import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import type { ApiResponse } from '@/types/api';
import type { Challenge, CreateChallengeInput } from '@/types';

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

async function parseResponse<T>(res: Response): Promise<T> {
  const result: ApiResponse<T> = await res.json();
  if (!res.ok) {
    throw new Error(result.success ? `HTTP ${res.status}` : result.error);
  }
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export const challengeService = {
  async list(token: string, status?: string): Promise<Challenge[]> {
    const url = new URL(API_ENDPOINTS.challenges.list);
    if (status) url.searchParams.set('status', status);
    const res = await fetchWithTimeout(url.toString(), {
      headers: authHeaders(token),
    });
    return parseResponse<Challenge[]>(res);
  },

  async getById(token: string, id: string): Promise<Challenge> {
    const res = await fetchWithTimeout(API_ENDPOINTS.challenges.detail(id), {
      headers: authHeaders(token),
    });
    return parseResponse<Challenge>(res);
  },

  async create(token: string, input: CreateChallengeInput): Promise<Challenge> {
    const res = await fetchWithTimeout(API_ENDPOINTS.challenges.create, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(input),
    });
    return parseResponse<Challenge>(res);
  },

  async accept(token: string, id: string): Promise<Challenge> {
    const res = await fetchWithTimeout(API_ENDPOINTS.challenges.accept(id), {
      method: 'POST',
      headers: authHeaders(token),
    });
    return parseResponse<Challenge>(res);
  },

  async decline(token: string, id: string, reason?: string): Promise<Challenge> {
    const res = await fetchWithTimeout(API_ENDPOINTS.challenges.decline(id), {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ reason }),
    });
    return parseResponse<Challenge>(res);
  },

  async cancel(token: string, id: string): Promise<Challenge> {
    const res = await fetchWithTimeout(API_ENDPOINTS.challenges.cancel(id), {
      method: 'POST',
      headers: authHeaders(token),
    });
    return parseResponse<Challenge>(res);
  },
};
