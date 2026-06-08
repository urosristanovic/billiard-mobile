import { StyleSheet, Text, View } from 'react-native';
import { scale } from '@/utils/scale';
import { useTheme } from '@/hooks/useTheme';
import { GhostButton } from '@/components/common/buttons/GhostButton';
import { Loading } from '@/components/common/states';
import { typography, spacing, radius } from '@/constants/theme';
import { detailStyles } from './detailStyles';

type MemberRowProps = {
  displayName: string;
  username: string;
  subtitle?: string;
  isAdmin?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  isPending?: boolean;
};

export const MemberRow = ({
  displayName,
  username,
  subtitle,
  isAdmin = false,
  actionLabel,
  onAction,
  isPending = false,
}: MemberRowProps) => {
  const { isDark, tk } = useTheme();

  return (
    <View
      style={[detailStyles.memberRow, { borderBottomColor: tk.border.subtle }]}
    >
      <View
        style={[
          detailStyles.memberAvatar,
          {
            backgroundColor: tk.surface.raised,
            borderColor: tk.border.strong,
          },
        ]}
      >
        <Text
          style={[detailStyles.memberAvatarText, { color: tk.text.muted }]}
        >
          {displayName.slice(0, 2).toUpperCase()}
        </Text>
      </View>
      <View style={detailStyles.memberInfo}>
        <Text
          style={[detailStyles.memberName, { color: tk.text.primary }]}
          numberOfLines={1}
        >
          {displayName}
        </Text>
        <Text style={[detailStyles.memberUsername, { color: tk.text.muted }]}>
          @{username}
          {subtitle ? ` · ${subtitle}` : null}
        </Text>
      </View>
      {isPending ? (
        <Loading style={{ minWidth: scale(60) }} />
      ) : isAdmin && !actionLabel ? (
        <View style={[styles.adminBadge, { borderColor: tk.border.default }]}>
          <Text style={[styles.adminBadgeText, { color: tk.text.muted }]}>
            ADMIN
          </Text>
        </View>
      ) : actionLabel && onAction ? (
        <GhostButton isDark={isDark} label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  adminBadge: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  adminBadgeText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.8,
  },
});
