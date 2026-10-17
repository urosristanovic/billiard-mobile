import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const ACCESSIBILITY_MIGRATED_KEY = 'keychain_after_first_unlock_migrated';

/**
 * Items must stay readable while the device is locked, because iOS can launch
 * the app in the background (push, prewarming, background fetch). With the
 * default `WHEN_UNLOCKED` the keychain throws "User interaction is not allowed".
 */
export const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

/**
 * True when the keychain is temporarily unavailable (device locked, app
 * launched in the background). This is not a missing/invalid credential.
 */
export function isKeychainLockedError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '');
  const cause =
    error instanceof Error && 'cause' in error
      ? String((error as { cause?: unknown }).cause ?? '')
      : '';
  const text = `${message} ${cause}`;
  return (
    text.includes('User interaction is not allowed') || text.includes('-25308')
  );
}

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

export async function getTokens(): Promise<StoredTokens | null> {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY, SECURE_STORE_OPTIONS),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY, SECURE_STORE_OPTIONS),
  ]);

  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
}

export async function setTokens(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken, SECURE_STORE_OPTIONS),
    SecureStore.setItemAsync(
      REFRESH_TOKEN_KEY,
      refreshToken,
      SECURE_STORE_OPTIONS,
    ),
  ]);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY, SECURE_STORE_OPTIONS),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY, SECURE_STORE_OPTIONS),
  ]);
}

/**
 * Existing installs stored tokens with `WHEN_UNLOCKED`, and updating an
 * existing keychain item does not change its accessibility. Re-create the
 * items once so they become readable after the first unlock.
 * Must be called while the device is unlocked (i.e. after a successful read).
 */
export async function migrateTokenAccessibility(): Promise<void> {
  try {
    const migrated = await SecureStore.getItemAsync(
      ACCESSIBILITY_MIGRATED_KEY,
      SECURE_STORE_OPTIONS,
    );
    if (migrated === 'true') return;

    const tokens = await getTokens();
    if (tokens) {
      await clearTokens();
      await setTokens(tokens.accessToken, tokens.refreshToken);
    }

    await SecureStore.setItemAsync(
      ACCESSIBILITY_MIGRATED_KEY,
      'true',
      SECURE_STORE_OPTIONS,
    );
  } catch {
    // Best effort; will retry on next launch.
  }
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
