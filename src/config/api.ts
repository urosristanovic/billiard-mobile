const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export const API_CONFIG = {
  baseURL: BASE_URL,
  timeout: 15000,
} as const;

const api = (path: string) => `${BASE_URL}${path}`;

export const API_ENDPOINTS = {
  // Auth
  auth: {
    signup: api('/api/auth/signup'),
    login: api('/api/auth/login'),
    logout: api('/api/auth/logout'),
    me: api('/api/auth/me'),
    profile: api('/api/auth/profile'),
    refresh: api('/api/auth/refresh'),
  },

  // Users
  users: {
    list: api('/api/users'),
    detail: (id: string) => api(`/api/users/${id}`),
    search: api('/api/users/search'),
  },

  // Matches
  matches: {
    list: api('/api/matches'),
    create: api('/api/matches'),
    stats: api('/api/matches/stats'),
    opponents: api('/api/matches/opponents'),
    detail: (id: string) => api(`/api/matches/${id}`),
    confirm: (id: string) => api(`/api/matches/${id}/confirm`),
    dispute: (id: string) => api(`/api/matches/${id}/dispute`),
    cancel: (id: string) => api(`/api/matches/${id}/cancel`),
    disputeAccept: (id: string) => api(`/api/matches/${id}/dispute/accept`),
    disputeReject: (id: string) => api(`/api/matches/${id}/dispute/reject`),
  },

  // Ratings
  ratings: {
    byUser: (userId: string) => api(`/api/ratings/${userId}`),
    history: (userId: string) => api(`/api/ratings/${userId}/history`),
  },

  // Leaderboard
  leaderboard: {
    list: api('/api/leaderboard'),
  },

  // Rules
  rules: {
    list: api('/api/rules'),
    byDiscipline: (discipline: string) => api(`/api/rules/${discipline}`),
  },

  // Tournaments
  tournaments: {
    list: api('/api/tournaments'),
    create: api('/api/tournaments'),
    my: api('/api/tournaments/my'),
    myPending: api('/api/tournaments/my/pending'),
    search: api('/api/tournaments/search'),
    detail: (id: string) => api(`/api/tournaments/${id}`),
    update: (id: string) => api(`/api/tournaments/${id}`),
    publish: (id: string) => api(`/api/tournaments/${id}/publish`),
    start: (id: string) => api(`/api/tournaments/${id}/start`),
    complete: (id: string) => api(`/api/tournaments/${id}/complete`),
    cancel: (id: string) => api(`/api/tournaments/${id}/cancel`),
    invite: (id: string) => api(`/api/tournaments/${id}/invite`),
    request: (id: string) => api(`/api/tournaments/${id}/request`),
    requests: (id: string) => api(`/api/tournaments/${id}/requests`),
    respondToRequest: (id: string, requestId: string) =>
      api(`/api/tournaments/${id}/requests/${requestId}`),
  },
} as const;
