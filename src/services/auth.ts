import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import { setTokens, clearTokens } from '@/lib/tokenStorage';
import { getAccessToken } from '@/features/auth/getAccessToken';
import type { ApiResponse } from '@/types/api';
import type {
  User,
  SignupInput,
  LoginInput,
  UpdateProfileInput,
} from '@/types/user';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface SignupPendingConfirmation {
  confirmEmail: true;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  password: string;
  tokenHash?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const result: ApiResponse<T> = await res.json();
  if (!res.ok) {
    throw new Error(result.success ? `HTTP ${res.status}` : result.error);
  }
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export const authService = {
  signup: async (input: SignupInput): Promise<User> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.auth.signup, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    const result: ApiResponse<AuthResponse | SignupPendingConfirmation> =
      await res.json();

    if (!res.ok) {
      throw new Error(result.success ? `HTTP ${res.status}` : result.error);
    }
    if (!result.success) throw new Error(result.error);

    if ('confirmEmail' in result.data) {
      throw new Error('CONFIRM_EMAIL');
    }

    const { user, accessToken, refreshToken } = result.data;
    await setTokens(accessToken, refreshToken);
    return user;
  },

  login: async (input: LoginInput): Promise<User> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.auth.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    const { user, accessToken, refreshToken } =
      await parseResponse<AuthResponse>(res);

    await setTokens(accessToken, refreshToken);
    return user;
  },

  forgotPassword: async (input: ForgotPasswordInput): Promise<null> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.auth.forgotPassword, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    return parseResponse<null>(res);
  },

  resetPassword: async (input: ResetPasswordInput): Promise<null> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.auth.resetPassword, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    return parseResponse<null>(res);
  },

  changePassword: async (input: ChangePasswordInput): Promise<null> => {
    const token = await getAccessToken();
    const res = await fetchWithTimeout(API_ENDPOINTS.auth.changePassword, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const { accessToken, refreshToken } = await parseResponse<{
      accessToken: string;
      refreshToken: string;
    }>(res);
    await setTokens(accessToken, refreshToken);
    return null;
  },

  logout: async (): Promise<null> => {
    try {
      const token = await getAccessToken();
      await fetchWithTimeout(API_ENDPOINTS.auth.logout, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } finally {
      await clearTokens();
    }
    return null;
  },

  deleteAccount: async (): Promise<null> => {
    const token = await getAccessToken();
    const res = await fetchWithTimeout(API_ENDPOINTS.auth.deleteAccount, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return parseResponse<null>(res);
  },

  me: async (): Promise<User> => {
    const token = await getAccessToken();

    const res = await fetchWithTimeout(API_ENDPOINTS.auth.me, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return parseResponse<User>(res);
  },

  updateProfile: async (input: UpdateProfileInput): Promise<User> => {
    const token = await getAccessToken();

    const res = await fetchWithTimeout(API_ENDPOINTS.auth.profile, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    return parseResponse<User>(res);
  },
};
