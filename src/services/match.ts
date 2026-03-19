import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  Match,
  CreateMatchInput,
  DisputeMatchInput,
  MatchListParams,
  MatchStats,
  MatchOpponent,
} from '@/types/match';

function buildHeaders(
  token: string,
  includeJson = false,
): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
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

function appendMatchQueryParams(url: URL, params?: MatchListParams) {
  if (!params) return;
  const entries = Object.entries(params);
  for (const [key, value] of entries) {
    if (value === undefined || value === null || value === '') continue;
    url.searchParams.set(key, String(value));
  }
}

export const matchService = {
  list: async (
    token: string,
    params?: MatchListParams,
  ): Promise<PaginatedResponse<Match>> => {
    const headers = buildHeaders(token);
    const url = new URL(API_ENDPOINTS.matches.list);
    appendMatchQueryParams(url, params);

    const res = await fetchWithTimeout(url.toString(), { headers });
    return parseResponse<PaginatedResponse<Match>>(res);
  },

  stats: async (
    token: string,
    params?: MatchListParams,
  ): Promise<MatchStats> => {
    const headers = buildHeaders(token);
    const url = new URL(API_ENDPOINTS.matches.stats);
    appendMatchQueryParams(url, params);

    const res = await fetchWithTimeout(url.toString(), { headers });
    return parseResponse<MatchStats>(res);
  },

  opponents: async (
    token: string,
    params?: MatchListParams,
  ): Promise<MatchOpponent[]> => {
    const headers = buildHeaders(token);
    const url = new URL(API_ENDPOINTS.matches.opponents);
    appendMatchQueryParams(url, params);

    const res = await fetchWithTimeout(url.toString(), { headers });
    return parseResponse<MatchOpponent[]>(res);
  },

  get: async (token: string, id: string): Promise<Match> => {
    const headers = buildHeaders(token);
    const res = await fetchWithTimeout(API_ENDPOINTS.matches.detail(id), {
      headers,
    });
    return parseResponse<Match>(res);
  },

  create: async (token: string, input: CreateMatchInput): Promise<Match> => {
    const headers = buildHeaders(token, true);
    const res = await fetchWithTimeout(API_ENDPOINTS.matches.create, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });
    return parseResponse<Match>(res);
  },

  createChallenge: async (
    token: string,
    input: {
      opponentId: string;
      discipline: CreateMatchInput['discipline'];
      bestOf?: number;
      message?: string;
    },
  ): Promise<Match> => {
    const headers = buildHeaders(token, true);
    const res = await fetchWithTimeout(API_ENDPOINTS.matches.createChallenge, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });
    return parseResponse<Match>(res);
  },

  confirm: async (token: string, matchId: string): Promise<Match> => {
    const headers = buildHeaders(token);
    const res = await fetchWithTimeout(API_ENDPOINTS.matches.confirm(matchId), {
      method: 'POST',
      headers,
    });
    return parseResponse<Match>(res);
  },

  record: async (
    token: string,
    matchId: string,
    input: { myScore: number; opponentScore: number; myBeers?: number; opponentBeers?: number },
  ): Promise<Match> => {
    const headers = buildHeaders(token, true);
    const res = await fetchWithTimeout(API_ENDPOINTS.matches.record(matchId), {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });
    return parseResponse<Match>(res);
  },

  acceptChallenge: async (token: string, matchId: string): Promise<Match> => {
    const headers = buildHeaders(token);
    const res = await fetchWithTimeout(
      API_ENDPOINTS.matches.challengeAccept(matchId),
      {
        method: 'POST',
        headers,
      },
    );
    return parseResponse<Match>(res);
  },

  declineChallenge: async (
    token: string,
    matchId: string,
    reason?: string,
  ): Promise<Match> => {
    const headers = buildHeaders(token, true);
    const res = await fetchWithTimeout(
      API_ENDPOINTS.matches.challengeDecline(matchId),
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ reason }),
      },
    );
    return parseResponse<Match>(res);
  },

  cancelChallengeRequest: async (token: string, matchId: string): Promise<void> => {
    const headers = buildHeaders(token);
    const res = await fetchWithTimeout(API_ENDPOINTS.matches.challengeCancel(matchId), {
      method: 'POST',
      headers,
    });
    await parseResponse<null>(res);
  },

  dispute: async (
    token: string,
    matchId: string,
    input: DisputeMatchInput,
  ): Promise<Match> => {
    const headers = buildHeaders(token, true);
    const res = await fetchWithTimeout(API_ENDPOINTS.matches.dispute(matchId), {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });
    return parseResponse<Match>(res);
  },

  cancel: async (
    token: string,
    matchId: string,
    reason?: string,
  ): Promise<Match> => {
    const headers = buildHeaders(token, true);
    const res = await fetchWithTimeout(API_ENDPOINTS.matches.cancel(matchId), {
      method: 'POST',
      headers,
      body: JSON.stringify({ reason }),
    });
    return parseResponse<Match>(res);
  },

  acceptDispute: async (token: string, matchId: string): Promise<Match> => {
    const headers = buildHeaders(token);
    const res = await fetchWithTimeout(
      API_ENDPOINTS.matches.disputeAccept(matchId),
      {
        method: 'POST',
        headers,
      },
    );
    return parseResponse<Match>(res);
  },

  counterDispute: async (
    token: string,
    matchId: string,
    input: DisputeMatchInput,
  ): Promise<Match> => {
    const headers = buildHeaders(token, true);
    const res = await fetchWithTimeout(
      API_ENDPOINTS.matches.disputeReject(matchId),
      {
        method: 'POST',
        headers,
        body: JSON.stringify(input),
      },
    );
    return parseResponse<Match>(res);
  },
};
