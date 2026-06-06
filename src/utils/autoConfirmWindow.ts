const minutes = parseInt(
  process.env.EXPO_PUBLIC_AUTO_CONFIRM_WINDOW_MINUTES ?? '1440',
  10,
);

/** Number of hours in the auto-confirm window (default 24). */
export const AUTO_CONFIRM_HOURS = Math.round(minutes / 60);
