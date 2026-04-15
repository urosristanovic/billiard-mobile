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
  RATINGS_HISTORY: (userId: string, discipline?: string, leaderboardId?: string) =>
    ['ratings', userId, 'history', discipline, leaderboardId] as const,

  LEADERBOARD: (params: Record<string, unknown>) =>
    ['leaderboard', params] as const,

  COUNTRIES: ['countries'] as const,
  CITIES: (countryId: string) => ['cities', countryId] as const,

  GROUPS: ['groups'] as const,
  GROUP_DETAIL: (id: string) => ['groups', id] as const,
  GROUP_MEMBERS: (id: string) => ['groups', id, 'members'] as const,

  CUSTOM_LEADERBOARDS: ['custom-leaderboards'] as const,
  CUSTOM_LEADERBOARDS_LIST: (visibility?: 'public' | 'private') =>
    ['custom-leaderboards', 'list', visibility ?? 'all'] as const,
  LEADERBOARDS_BROWSE: (q: string) => ['custom-leaderboards', 'browse', q] as const,
  CUSTOM_LEADERBOARD_DETAIL: (id: string) => ['custom-leaderboards', id] as const,
  CUSTOM_LEADERBOARD_MEMBERS: (id: string) =>
    ['custom-leaderboards', id, 'members'] as const,
  CUSTOM_LEADERBOARD_PENDING: (id: string) =>
    ['custom-leaderboards', id, 'pending'] as const,

  CHALLENGES: ['challenges'] as const,
  CHALLENGE_DETAIL: (id: string) => ['challenges', id] as const,

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
  TOURNAMENT_STANDINGS: (id: string) =>
    ['tournaments', id, 'standings'] as const,
} as const;
