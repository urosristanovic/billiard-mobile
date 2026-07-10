import { createNavigationContainerRef } from '@react-navigation/native';

/**
 * Root-level modal stack param list.
 * Defined here (not in RootNavigator) so screens registered in the root stack
 * can import this type without creating a circular dependency with RootNavigator.
 */
export type RootStackParamList = {
  Main: undefined;
  Notifications: undefined;
  NotificationSettings: undefined;
};

/**
 * Shared navigation ref attached to the root NavigationContainer.
 * Import this file (not RootNavigator) to avoid the App ↔ RootNavigator
 * require cycle when navigating imperatively from providers or services.
 */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
