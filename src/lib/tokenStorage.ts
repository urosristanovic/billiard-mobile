import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

export async function getTokens(): Promise<StoredTokens | null> {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  ]);

  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
}

export async function setTokens(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
  ]);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1];
    if (!payload) return true;

    const decoded = JSON.parse(atob(payload)) as { exp?: number };
    if (typeof decoded.exp !== 'number') return true;

    // Consider token expired 30 seconds before actual expiry to avoid edge cases
    return Date.now() / 1000 >= decoded.exp - 30;
  } catch {
    return true;
  }
}
