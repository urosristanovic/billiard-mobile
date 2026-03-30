import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  Tournament,
  TournamentSummary,
  TournamentRequest,
  CreateTournamentInput,
  UpdateTournamentInput,
  TournamentListParams,
  TournamentStats,
  RespondToRequestInput,
  ReportResultInput,
  StandingsRow,
} from '@/types/tournament';

function buildHeaders(
  token: string,
  includeJson = false,
): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  if (includeJson) headers['Content-Type'] = 'application/json';
  return headers;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const result: ApiResponse<T> = await res.json();
  if (!res.ok) {
    throw new Error(
      result.success ? `HTTP ${res.status}: ${res.statusText}` : result.error,
    );
  }
  if (!result.success) throw new Error(result.error);
  return result.data;
}

interface MyTournamentsResponse {
  active: TournamentSummary[];
  past: TournamentSummary[];
  stats: TournamentStats;
}

export const tournamentService = {
  list: async (
    token: string,
    params?: TournamentListParams,
  ): Promise<PaginatedResponse<TournamentSummary>> => {
    const url = new URL(API_ENDPOINTS.tournaments.list);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
      });
    }
    const res = await fetchWithTimeout(url.toString(), {
      headers: buildHeaders(token),
    });
    return parseResponse<PaginatedResponse<TournamentSummary>>(res);
  },

  my: async (token: string): Promise<MyTournamentsResponse> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.tournaments.my, {
      headers: buildHeaders(token),
    });
    return parseResponse<MyTournamentsResponse>(res);
  },

  myPending: async (token: string): Promise<TournamentRequest[]> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.tournaments.myPending, {
      headers: buildHeaders(token),
    });
    return parseResponse<TournamentRequest[]>(res);
  },

  search: async (
    token: string,
    q: string,
    page = 1,
  ): Promise<PaginatedResponse<TournamentSummary>> => {
    const url = new URL(API_ENDPOINTS.tournaments.search);
    url.searchParams.set('q', q);
    url.searchParams.set('page', String(page));
    const res = await fetchWithTimeout(url.toString(), {
      headers: buildHeaders(token),
    });
    return parseResponse<PaginatedResponse<TournamentSummary>>(res);
  },

  get: async (token: string, id: string): Promise<Tournament> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.tournaments.detail(id), {
      headers: buildHeaders(token),
    });
    return parseResponse<Tournament>(res);
  },

  create: async (
    token: string,
    input: CreateTournamentInput,
  ): Promise<TournamentSummary> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.tournaments.create, {
      method: 'POST',
      headers: buildHeaders(token, true),
      body: JSON.stringify(input),
    });
    return parseResponse<TournamentSummary>(res);
  },

  update: async (
    token: string,
    id: string,
    input: UpdateTournamentInput,
  ): Promise<Tournament> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.tournaments.update(id), {
      method: 'PUT',
      headers: buildHeaders(token, true),
      body: JSON.stringify(input),
    });
    return parseResponse<Tournament>(res);
  },

  publish: async (token: string, id: string): Promise<Tournament> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.tournaments.publish(id), {
      method: 'POST',
      headers: buildHeaders(token),
    });
    return parseResponse<Tournament>(res);
  },

  start: async (token: string, id: string): Promise<Tournament> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.tournaments.start(id), {
      method: 'POST',
      headers: buildHeaders(token),
    });
    return parseResponse<Tournament>(res);
  },

  complete: async (token: string, id: string): Promise<Tournament> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.tournaments.complete(id), {
      method: 'POST',
      headers: buildHeaders(token),
    });
    return parseResponse<Tournament>(res);
  },

  cancel: async (token: string, id: string): Promise<Tournament> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.tournaments.cancel(id), {
      method: 'POST',
      headers: buildHeaders(token),
    });
    return parseResponse<Tournament>(res);
  },

  invite: async (
    token: string,
    id: string,
    userId: string,
  ): Promise<TournamentRequest> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.tournaments.invite(id), {
      method: 'POST',
      headers: buildHeaders(token, true),
      body: JSON.stringify({ userId }),
    });
    return parseResponse<TournamentRequest>(res);
  },

  requestSpot: async (token: string, id: string): Promise<TournamentRequest> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.tournaments.request(id), {
      method: 'POST',
      headers: buildHeaders(token),
    });
    return parseResponse<TournamentRequest>(res);
  },

  getRequests: async (
    token: string,
    id: string,
    status = 'pending',
  ): Promise<TournamentRequest[]> => {
    const url = new URL(API_ENDPOINTS.tournaments.requests(id));
    url.searchParams.set('status', status);
    const res = await fetchWithTimeout(url.toString(), {
      headers: buildHeaders(token),
    });
    return parseResponse<TournamentRequest[]>(res);
  },

  respondToRequest: async (
    token: string,
    tournamentId: string,
    requestId: string,
    input: RespondToRequestInput,
  ): Promise<TournamentRequest> => {
    const res = await fetchWithTimeout(
      API_ENDPOINTS.tournaments.respondToRequest(tournamentId, requestId),
      {
        method: 'PUT',
        headers: buildHeaders(token, true),
        body: JSON.stringify(input),
      },
    );
    return parseResponse<TournamentRequest>(res);
  },

  reportResult: async (
    token: string,
    tournamentId: string,
    matchId: string,
    input: ReportResultInput,
  ): Promise<Tournament> => {
    const res = await fetchWithTimeout(
      API_ENDPOINTS.tournaments.reportResult(tournamentId, matchId),
      {
        method: 'POST',
        headers: buildHeaders(token, true),
        body: JSON.stringify(input),
      },
    );
    return parseResponse<Tournament>(res);
  },

  getStandings: async (
    token: string,
    id: string,
  ): Promise<StandingsRow[]> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.tournaments.standings(id), {
      headers: buildHeaders(token),
    });
    return parseResponse<StandingsRow[]>(res);
  },

  editResult: async (
    token: string,
    tournamentId: string,
    matchId: string,
    input: ReportResultInput,
  ): Promise<Tournament> => {
    const res = await fetchWithTimeout(
      API_ENDPOINTS.tournaments.reportResult(tournamentId, matchId),
      {
        method: 'PUT',
        headers: buildHeaders(token, true),
        body: JSON.stringify(input),
      },
    );
    return parseResponse<Tournament>(res);
  },
};
