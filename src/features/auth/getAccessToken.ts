import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import {
  getTokens,
  setTokens,
  clearTokens,
  isTokenExpired,
} from '@/lib/tokenStorage';

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const tokens = await getTokens();
  if (!tokens) throw new Error('Not authenticated');

  const res = await fetchWithTimeout(API_ENDPOINTS.auth.refresh, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  });

  const result = await res.json();

  if (!res.ok || !result.success) {
    await clearTokens();
    throw new Error('Session expired. Please log in again.');
  }

  const { accessToken, refreshToken } = result.data;
  await setTokens(accessToken, refreshToken);
  return accessToken;
}

export async function getAccessToken(): Promise<string> {
  const tokens = await getTokens();

  if (!tokens) throw new Error('Not authenticated');

  if (!isTokenExpired(tokens.accessToken)) {
    return tokens.accessToken;
  }

  // Deduplicate concurrent refresh calls
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
