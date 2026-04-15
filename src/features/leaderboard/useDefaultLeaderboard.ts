import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import { authService } from '@/services/auth';

/**
 * Reads and mutates the user's default leaderboard preference.
 *
 * Setting a default causes the leaderboard tab to auto-load that leaderboard's
 * rankings view on next visit instead of showing the list.
 */
export const useDefaultLeaderboard = () => {
  const user = useAuthStore(s => s.user);
  const setUser = useAuthStore(s => s.setUser);

  const setDefault = useMutation({
    mutationFn: async (id: string) => authService.updateProfile({ defaultLeaderboardId: id }),
    onSuccess: updatedUser => setUser(updatedUser),
  });

  const clearDefault = useMutation({
    mutationFn: async () => authService.updateProfile({ defaultLeaderboardId: null }),
    onSuccess: updatedUser => setUser(updatedUser),
  });

  return {
    defaultLeaderboardId: user?.defaultLeaderboardId ?? null,
    setDefault,
    clearDefault,
  };
};
