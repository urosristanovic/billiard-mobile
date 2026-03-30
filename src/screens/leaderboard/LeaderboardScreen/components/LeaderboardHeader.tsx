import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { AvatarButton } from '@/components/common/buttons';
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
        <Text style={[styles.title, { color: tk.text.primary }]}>
          {t('title')}
        </Text>
        <AvatarButton />
      </View>
      <View style={styles.secondRow}>
        <TouchableOpacity
          onPress={onOpenFilters}
          accessibilityRole='button'
          accessibilityLabel={t('filters.title')}
          style={[
            styles.headerActionButton,
            {
              borderColor: activeFilterCount > 0 ? tk.primary[500] : tk.border.default,
              backgroundColor: activeFilterCount > 0 ? tk.primary[900] : 'transparent',
            },
          ]}
        >
          <Text
            style={[
              styles.headerActionLabel,
              { color: activeFilterCount > 0 ? tk.primary[300] : tk.text.muted },
            ]}
          >
            {t('filters.title')}
          </Text>
          {activeFilterCount > 0 && (
            <View style={[styles.filterBadge, { backgroundColor: tk.primary[500] }]}>
              <Text
                style={[styles.filterBadgeText, { color: tk.background.primary }]}
              >
                {activeFilterCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCreateLeaderboard}
          accessibilityRole='button'
          accessibilityLabel={t('createFab')}
          style={[
            styles.headerActionButton,
            { borderColor: tk.primary[600], backgroundColor: 'transparent' },
          ]}
        >
          <Text style={[styles.headerActionLabel, { color: tk.primary[400] }]}>
            {t('createFab')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCreateGroup}
          accessibilityRole='button'
          accessibilityLabel={t('createGroup')}
          style={[
            styles.headerActionButton,
            { borderColor: tk.primary[600], backgroundColor: 'transparent' },
          ]}
        >
          <Text style={[styles.headerActionLabel, { color: tk.primary[400] }]}>
            {t('createGroup')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
