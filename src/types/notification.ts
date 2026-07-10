export type NotificationCategory =
  | 'matches'
  | 'tournaments'
  | 'leaderboards'
  | 'engagement';

export type AppNotification = {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
};

export type NotificationPref = {
  category: NotificationCategory;
  pushEnabled: boolean;
  inboxEnabled: boolean;
};
