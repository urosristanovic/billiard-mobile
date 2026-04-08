import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { AppLogo } from '@/components/common/AppLogo';
import { iconSize } from '@/constants/theme';
import { scale } from '@/utils/scale';
import { PlusIcon } from '@/components/common/icons';
import { SecondaryButton, GhostButton } from '@/components/common/buttons';
import { styles } from '../styles';

interface Props {
  activeFilterCount: number;
  onOpenFilters: () => void;
  onCreateLeaderboard: () => void;
  onCreateGroup: () => void;
}

export const LeaderboardHeader = ({
  activeFilterCount,
  onOpenFilters,
  onCreateLeaderboard,
  onCreateGroup,
}: Props) => {
  const { t } = useTranslation('leaderboard');
  const { tk } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: tk.primary[900] }]}>
      <View style={styles.headerTopRow}>
        <AppLogo />
      </View>
      <View style={styles.secondRow}>
        <View style={styles.secondRowLeft}>
          <SecondaryButton
            label={t('title')}
            size='xs'
            icon={<PlusIcon size={iconSize.xs} color={tk.primary[500]} />}
            accessibilityLabel={t('createFab')}
            onPress={onCreateLeaderboard}
          />

          <SecondaryButton
            label={t('filters.group')}
            size='xs'
            icon={<PlusIcon size={iconSize.xs} color={tk.primary[500]} />}
            accessibilityLabel={t('createGroup')}
            onPress={onCreateGroup}
          />
        </View>

        <GhostButton
          label={t('filters.title')}
          size='sm'
          icon={
            activeFilterCount > 0 ? undefined : (
              <Feather name='sliders' size={iconSize.sm} color={tk.primary[600]} />
            )
          }
          active={activeFilterCount > 0}
          badge={activeFilterCount}
          accessibilityLabel={t('filters.title')}
          onPress={onOpenFilters}
        />
      </View>
    </View>
  );
};
