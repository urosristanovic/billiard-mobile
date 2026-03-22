import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/common/toast';
import { authService } from '@/services/auth';
import type {
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from '@/services/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { clearTokens } from '@/lib/tokenStorage';
import { QUERY_KEYS } from '@/config/queryKeys';
import type { SignupInput, LoginInput, UpdateProfileInput } from '@/types/user';

export const useAuthMutations = () => {
  const { t } = useTranslation('common');
  const { t: tAuth } = useTranslation('auth');
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { setUser, clearAuth } = useAuthStore();
  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : t('error');

  const signup = useMutation({
    mutationFn: (input: SignupInput) => authService.signup(input),
    onSuccess: user => {
      setUser(user);
      queryClient.setQueryData(QUERY_KEYS.ME, user);
    },
    onError: error => {
      const message = getErrorMessage(error);
      if (message === 'CONFIRM_EMAIL') return;
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message,
      });
    },
  });

  const login = useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: user => {
      setUser(user);
      queryClient.setQueryData(QUERY_KEYS.ME, user);
    },
    onError: error => {
      const message = getErrorMessage(error);
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: message === 'account_deleted' ? tAuth('accountDeleted') : message,
      });
    },
  });

  const logout = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const updateProfile = useMutation({
    mutationFn: (input: UpdateProfileInput) => authService.updateProfile(input),
    onSuccess: user => {
      setUser(user);
      queryClient.setQueryData(QUERY_KEYS.ME, user);
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const forgotPassword = useMutation({
    mutationFn: (input: ForgotPasswordInput) => authService.forgotPassword(input),
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const resetPassword = useMutation({
    mutationFn: (input: ResetPasswordInput) => authService.resetPassword(input),
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const changePassword = useMutation({
    mutationFn: (input: ChangePasswordInput) => authService.changePassword(input),
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const deleteAccount = useMutation({
    mutationFn: () => authService.deleteAccount(),
    onSuccess: async () => {
      await clearTokens();
      clearAuth();
      queryClient.clear();
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  return {
    signup,
    login,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    deleteAccount,
  };
};
