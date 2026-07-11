import type * as NotificationsAPI from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Requests push permission and returns the Expo push token, or null if
 * permission is denied, we're running on a simulator, or the environment
 * doesn't support remote push (Android Expo Go SDK 53+).
 */
export async function registerForPush(): Promise<string | null> {
  // Android Expo Go SDK 53+ removed remote push support. Bail before
  // require('expo-notifications') so the .fx side-effect module never runs.
  // Note: Constants.isDevice is undefined in SDK 53 dev builds (deprecated in
  // favour of expo-device) — use === false so only an explicit simulator value
  // bails out; undefined means "unknown, assume real device".
  if (
    Constants.isDevice === false ||
    (Platform.OS === 'android' && Constants.executionEnvironment === 'storeClient')
  ) {
    return null;
  }

  // Safe to require here — we've already ruled out Android Expo Go.
  const Notifications: typeof NotificationsAPI = require('expo-notifications');

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return null;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId as
      | string
      | undefined;

    const { data: token } = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    return token;
  } catch {
    // Unexpected failure — return null so the rest of the app continues normally.
    return null;
  }
}
