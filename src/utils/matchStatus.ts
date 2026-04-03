import { type MatchStatus } from '@/types/match';
import { theme } from '@/constants/theme';

type ThemeTokens = typeof theme.light | typeof theme.dark;

export const PENDING_STATUSES: MatchStatus[] = [
  'challenge_requested',
  'challenge',
];

export const isMatchPending = (status: MatchStatus): boolean =>
  PENDING_STATUSES.includes(status);

export const getStatusColor = (
  status: MatchStatus,
  tk: ThemeTokens,
): string => {
  const map: Record<MatchStatus, string> = {
    challenge_requested: tk.info.default,
    challenge: tk.primary[400],
    pending_confirmation: tk.warning.default,
    confirmed: '#19500D',
    disputed: tk.error.default,
    cancelled: tk.text.muted,
  };
  return map[status];
};

export const getStatusBg = (status: MatchStatus, tk: ThemeTokens): string => {
  const map: Record<MatchStatus, string> = {
    challenge_requested: tk.info.light,
    challenge: tk.primary[900],
    pending_confirmation: tk.warning.light,
    confirmed: '#001600',
    disputed: tk.error.light,
    cancelled: tk.surface.overlay,
  };
  return map[status];
};
