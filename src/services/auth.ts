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
