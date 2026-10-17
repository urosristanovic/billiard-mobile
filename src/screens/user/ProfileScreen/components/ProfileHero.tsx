import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import type { User } from '@/types/user';
import { iconSize, radius } from '@/constants/theme';
import { filters } from '@/constants/filters';
import { scale } from '@/utils/scale';
import { styles } from '../styles';

interface ProfileHeroProps {
  user: User;
  isDark: boolean;
  onChangePhoto?: () => void;
  uploadingPhoto?: boolean;
}

export const ProfileHero = ({
  user,
  onChangePhoto,
  uploadingPhoto = false,
}: ProfileHeroProps) => {
  const { tk } = useTheme();

  const avatarContent = uploadingPhoto ? (
    <ActivityIndicator color={tk.primary[300]} />
  ) : user.avatarUrl ? (
    <View style={heroStyles.avatarImage}>
      <Image
        source={{ uri: user.avatarUrl }}
        style={heroStyles.imageFill}
        contentFit="cover"
      />
      <View style={filters.grayscaleOverlay()} />
    </View>
  ) : (
    <Text style={[styles.avatarInitial, { color: tk.primary[300] }]}>
      {user.displayName.slice(0, 2).toUpperCase()}
    </Text>
  );

  return (
    <View
      style={[
        styles.hero,
        { backgroundColor: tk.surface.raised, borderColor: tk.primary[800] },
      ]}
    >
      <TouchableOpacity
        onPress={onChangePhoto}
        disabled={!onChangePhoto || uploadingPhoto}
        activeOpacity={onChangePhoto ? 0.7 : 1}
        style={heroStyles.avatarWrapper}
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
          {avatarContent}
        </View>
        {onChangePhoto && !uploadingPhoto && (
          <View
            style={[
              heroStyles.cameraOverlay,
              { backgroundColor: tk.primary[600] },
            ]}
          >
            <Feather name="camera" size={iconSize.xs} color="#fff" />
          </View>
        )}
      </TouchableOpacity>

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

const heroStyles = StyleSheet.create({
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: scale(92),
    height: scale(92),
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  imageFill: {
    width: '100%',
    height: '100%',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: scale(26),
    height: scale(26),
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
