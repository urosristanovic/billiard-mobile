import { Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import type { User } from '@/types/user';
import { styles } from '../styles';

interface ProfileHeroProps {
  user: User;
  isDark: boolean;
}

export const ProfileHero = ({
  user,
}: ProfileHeroProps) => {
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
      <Text style={[styles.displayName, { color: tk.text.primary }]}>
        {user.displayName}
      </Text>
      <Text style={[styles.username, { color: tk.text.muted }]}>
        @{user.username}
      </Text>
      {user.countryName && (
        <Text style={[styles.location, { color: tk.text.secondary }]}>
          📍 {[user.cityName, user.countryName].filter(Boolean).join(', ')}
        </Text>
      )}
      {user.bio && (
        <Text style={[styles.bio, { color: tk.text.secondary }]}>
          {user.bio}
        </Text>
      )}
    </View>
  );
};
