export const featureFlags = {
  /**
   * Rated tournaments affect players' Glicko-2 ratings.
   * Hidden until premium gating is implemented — flip EXPO_PUBLIC_RATED_TOURNAMENT_ENABLED=true to enable.
   */
  ratedTournament: (): boolean =>
    process.env.EXPO_PUBLIC_RATED_TOURNAMENT_ENABLED === 'true',
};
