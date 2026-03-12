interface OpponentLabelInput {
  id: string;
  username?: string | null;
  displayName?: string | null;
}

export const getOpponentLabel = ({
  id,
  username,
  displayName,
}: OpponentLabelInput): string => {
  if (displayName?.trim()) return displayName.trim();
  if (username?.trim()) return username.trim();
  return id.slice(0, 8);
};
