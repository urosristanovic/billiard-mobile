import * as SecureStore from 'expo-secure-store';

const ONBOARDING_KEY = 'has_seen_onboarding';

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
