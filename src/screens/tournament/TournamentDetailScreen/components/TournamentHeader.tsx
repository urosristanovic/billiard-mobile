import { ScreenHeader } from '@/components/common/layout';

interface TournamentHeaderProps {
  name: string;
  onBack: () => void;
}

export const TournamentHeader = ({ name, onBack }: TournamentHeaderProps) => (
  <ScreenHeader title={name} onBack={onBack} />
);
