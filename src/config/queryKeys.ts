export const QUERY_KEYS = {
  ME: ['me'] as const,

  USERS: ['users'] as const,
  USER_DETAIL: (id: string) => ['users', id] as const,
  USER_SEARCH: (query: string) => ['users', 'search', query] as const,

  MATCHES: ['matches'] as const,
  MATCHES_LIST_BASE: ['matches', 'list'] as const,
  MATCHES_LIST: (params: object) => ['matches', 'list', params] as const,
  MATCH_DETAIL: (id: string) => ['matches', id] as const,
  MATCH_STATS: (params: object) => ['matches', 'stats', params] as const,
  MATCH_OPPONENTS: (params: object) =>
    ['matches', 'opponents', params] as const,

  RATINGS: (userId: string) => ['ratings', userId] as const,
  RATINGS_HISTORY: (userId: string, discipline?: string) =>
    ['ratings', userId, 'history', discipline] as const,

  LEADERBOARD: (params: Record<string, unknown>) =>
    ['leaderboard', params] as const,

  RULES: ['rules'] as const,
  RULES_DISCIPLINE: (discipline: string) => ['rules', discipline] as const,

  TOURNAMENTS: ['tournaments'] as const,
  TOURNAMENTS_LIST: (params: object) =>
    ['tournaments', 'list', params] as const,
  TOURNAMENTS_MY: ['tournaments', 'my'] as const,
  TOURNAMENTS_MY_PENDING: ['tournaments', 'my', 'pending'] as const,
  TOURNAMENTS_SEARCH: (q: string) =>
    ['tournaments', 'search', q] as const,
  TOURNAMENT_DETAIL: (id: string) => ['tournaments', id] as const,
  TOURNAMENT_REQUESTS: (id: string) =>
    ['tournaments', id, 'requests'] as const,
} as const;
