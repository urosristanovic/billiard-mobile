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
    forgotPassword: api('/api/auth/forgot-password'),
    resetPassword: api('/api/auth/reset-password'),
    changePassword: api('/api/auth/change-password'),
    logout: api('/api/auth/logout'),
    deleteAccount: api('/api/auth/delete-account'),
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
    createChallenge: api('/api/matches/challenge'),
    stats: api('/api/matches/stats'),
    opponents: api('/api/matches/opponents'),
    detail: (id: string) => api(`/api/matches/${id}`),
    confirm: (id: string) => api(`/api/matches/${id}/confirm`),
    record: (id: string) => api(`/api/matches/${id}/record`),
    dispute: (id: string) => api(`/api/matches/${id}/dispute`),
    cancel: (id: string) => api(`/api/matches/${id}/cancel`),
    challengeAccept: (id: string) => api(`/api/matches/${id}/challenge/accept`),
    challengeDecline: (id: string) => api(`/api/matches/${id}/challenge/decline`),
    challengeCancel: (id: string) => api(`/api/matches/${id}/challenge/cancel`),
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

  // Locations
  locations: {
    countries: api('/api/locations/countries'),
    cities: (countryId: string) => api(`/api/locations/countries/${countryId}/cities`),
    suggestCity: api('/api/locations/cities/suggest'),
  },

  // Groups
  groups: {
    list: api('/api/groups'),
    create: api('/api/groups'),
    detail: (id: string) => api(`/api/groups/${id}`),
    update: (id: string) => api(`/api/groups/${id}`),
    delete: (id: string) => api(`/api/groups/${id}`),
    members: (id: string) => api(`/api/groups/${id}/members`),
    addMember: (id: string) => api(`/api/groups/${id}/members`),
    removeMember: (id: string, userId: string) => api(`/api/groups/${id}/members/${userId}`),
  },

  // Custom leaderboards
  customLeaderboards: {
    list: api('/api/custom-leaderboards'),
    create: api('/api/custom-leaderboards'),
    detail: (id: string) => api(`/api/custom-leaderboards/${id}`),
    update: (id: string) => api(`/api/custom-leaderboards/${id}`),
    delete: (id: string) => api(`/api/custom-leaderboards/${id}`),
    members: (id: string) => api(`/api/custom-leaderboards/${id}/members`),
    addMember: (id: string) => api(`/api/custom-leaderboards/${id}/members`),
    removeMember: (id: string, userId: string) => api(`/api/custom-leaderboards/${id}/members/${userId}`),
  },

  // Challenges
  challenges: {
    list: api('/api/challenges'),
    create: api('/api/challenges'),
    detail: (id: string) => api(`/api/challenges/${id}`),
    accept: (id: string) => api(`/api/challenges/${id}/accept`),
    decline: (id: string) => api(`/api/challenges/${id}/decline`),
    cancel: (id: string) => api(`/api/challenges/${id}/cancel`),
  },

  // Feedback
  feedback: {
    submit: api('/api/feedback'),
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
    reportResult: (id: string, matchId: string) =>
      api(`/api/tournaments/${id}/matches/${matchId}/result`),
    requests: (id: string) => api(`/api/tournaments/${id}/requests`),
    respondToRequest: (id: string, requestId: string) =>
      api(`/api/tournaments/${id}/requests/${requestId}`),
  },
} as const;
