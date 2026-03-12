import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SecondaryButton } from '@/components/common/buttons';
import { useTheme } from '@/hooks/useTheme';
import type { User } from '@/types/user';
import { styles } from '../styles';

interface ProfileHeroProps {
  user: User;
  isDark: boolean;
  onEditPress: () => void;
}

export const ProfileHero = ({
  user,
  isDark,
  onEditPress,
}: ProfileHeroProps) => {
  const { t: tAuth } = useTranslation('auth');
  const { tk } = useTheme();

  return (
    <View
      style={[
        styles.hero,
        { backgroundColor: tk.surface.raised, borderColor: tk.primary[800] },
      ]}
    >
      <View
        style={[
          styles.avatarCircle,
          {
            backgroundColor: tk.background.secondary,
            borderColor: tk.primary[500],
          },
        ]}
      >
        <Text style={[styles.avatarInitial, { color: tk.primary[300] }]}>
          {user.displayName.slice(0, 2).toUpperCase()}
        </Text>
      </View>
      <Text
        style={[
          styles.contenderTag,
          { color: tk.primary[300], borderColor: tk.primary[700] },
        ]}
      >
        Contender
      </Text>
      <Text style={[styles.displayName, { color: tk.text.primary }]}>
        {user.displayName}
      </Text>
      <Text style={[styles.username, { color: tk.text.muted }]}>
        @{user.username}
      </Text>
      {user.location && (
        <Text style={[styles.location, { color: tk.text.secondary }]}>
          📍 {user.location}
        </Text>
      )}
      {user.bio && (
        <Text style={[styles.bio, { color: tk.text.secondary }]}>
          {user.bio}
        </Text>
      )}
      <SecondaryButton
        label={tAuth('profile.editButton')}
        onPress={onEditPress}
        isDark={isDark}
      />
    </View>
  );
};
