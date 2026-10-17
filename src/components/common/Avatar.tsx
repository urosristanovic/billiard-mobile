import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/useTheme';
import { radius, typography } from '@/constants/theme';
import { filters } from '@/constants/filters';
import { scale } from '@/utils/scale';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  /** Supabase Storage public URL — if absent, renders initials. */
  uri?: string | null;
  /** Display name or any string used to derive initials (first 2 chars). */
  name: string;
  size?: AvatarSize;
}

const SIZES: Record<AvatarSize, number> = {
  xs: scale(28),
  sm: scale(36),
  md: scale(44),
  lg: scale(56),
  xl: scale(72),
};

const FONT_SIZES: Record<AvatarSize, number> = {
  xs: typography.size.xs,
  sm: typography.size.xs,
  md: typography.size.sm,
  lg: typography.size.base,
  xl: typography.size.xl,
};

export const Avatar = ({ uri, name, size = 'md' }: AvatarProps) => {
  const { tk } = useTheme();
  const dim = SIZES[size];
  const fontSize = FONT_SIZES[size];
  const initials = name.slice(0, 2).toUpperCase();

  const containerStyle = [
    styles.base,
    {
      width: dim,
      height: dim,
      borderRadius: radius.full,
      borderColor: tk.border.strong,
      backgroundColor: tk.surface.raised,
    },
  ];

  if (uri) {
    return (
      <View style={containerStyle}>
        <Image
          source={{ uri }}
          style={styles.imageFill}
          contentFit="cover"
        />
        <View style={filters.grayscaleOverlay()} />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text style={[styles.initials, { fontSize, color: tk.text.muted }]}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imageFill: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
  },
});
