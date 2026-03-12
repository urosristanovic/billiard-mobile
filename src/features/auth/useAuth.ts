import { useAuthStore } from '@/stores/useAuthStore';

export const useAuth = () => {
  const user = useAuthStore(s => s.user);
  const isLoading = useAuthStore(s => s.isLoading);
  const isInitialized = useAuthStore(s => s.isInitialized);

  return { user, isLoading, isInitialized, isAuthenticated: !!user };
};

export const usePermissions = () => {
  const user = useAuthStore(s => s.user);
  const isAdmin = user?.role === 'admin';
  const canSeeActions = (resourceOwnerId: string) =>
    isAdmin || user?.id === resourceOwnerId;

  return { isAdmin, canSeeActions };
};
