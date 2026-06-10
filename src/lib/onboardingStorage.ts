import * as SecureStore from 'expo-secure-store';

const ONBOARDING_KEY = 'has_seen_onboarding';
const HAS_LOGGED_IN_KEY = 'has_logged_in_before';

export async function getHasSeenOnboarding(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(ONBOARDING_KEY);
  return value === 'true';
}

export async function setHasSeenOnboarding(): Promise<void> {
  await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
}

export async function clearHasSeenOnboarding(): Promise<void> {
  await SecureStore.deleteItemAsync(ONBOARDING_KEY);
}

export async function getHasLoggedInBefore(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(HAS_LOGGED_IN_KEY);
  return value === 'true';
}

export async function setHasLoggedInBefore(): Promise<void> {
  await SecureStore.setItemAsync(HAS_LOGGED_IN_KEY, 'true');
}
