import { type TournamentStatus } from '@/types/tournament';
import { theme } from '@/constants/theme';

type ThemeTokens = typeof theme.light | typeof theme.dark;

export const getTournamentStatusColor = (
  status: TournamentStatus,
  tk: ThemeTokens,
): string => {
  const map: Record<TournamentStatus, string> = {
    draft: tk.text.muted,
    registration: tk.primary[600],
    in_progress: tk.primary[500],
    pending_review: tk.warning.text,
    completed: tk.success.text,
    cancelled: tk.error.text,
  };
  return map[status];
};

export const getTournamentStatusBg = (
  status: TournamentStatus,
  tk: ThemeTokens,
): string => {
  const map: Record<TournamentStatus, string> = {
    draft: tk.surface.overlay,
    registration: tk.primary[900],
    in_progress: tk.primary[900],
    pending_review: tk.warning.light,
    completed: tk.success.light,
    cancelled: tk.error.light,
  };
  return map[status];
};

export const getTournamentStatusBorder = (
  status: TournamentStatus,
  tk: ThemeTokens,
): string => {
  const map: Record<TournamentStatus, string> = {
    draft: tk.border.default,
    registration: tk.primary[700],
    in_progress: tk.primary[700],
    pending_review: tk.warning.border,
    completed: tk.success.border,
    cancelled: tk.error.border,
  };
  return map[status];
};
