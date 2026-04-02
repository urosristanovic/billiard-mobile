import { ActivityIndicator, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { GhostButton } from '@/components/common/buttons/GhostButton';
import { detailStyles } from './detailStyles';

type MemberRowProps = {
  displayName: string;
  username: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  isPending?: boolean;
};

export const MemberRow = ({
  displayName,
  username,
  subtitle,
  actionLabel,
  onAction,
  isPending = false,
}: MemberRowProps) => {
  const { isDark, tk } = useTheme();

  return (
    <View
      style={[detailStyles.memberRow, { borderBottomColor: tk.primary[900] }]}
    >
      <View
        style={[
          detailStyles.memberAvatar,
          {
            backgroundColor: tk.primary[900],
            borderColor: tk.primary[700],
          },
        ]}
      >
        <Text
          style={[detailStyles.memberAvatarText, { color: tk.primary[300] }]}
        >
          {displayName.slice(0, 2).toUpperCase()}
        </Text>
      </View>
      <View style={detailStyles.memberInfo}>
        <Text style={[detailStyles.memberName, { color: tk.text.primary }]}>
          {displayName}
        </Text>
        <Text style={[detailStyles.memberUsername, { color: tk.text.muted }]}>
          @{username}
          {subtitle ? ` · ${subtitle}` : null}
        </Text>
      </View>
      {isPending ? (
        <ActivityIndicator size='small' color={tk.text.muted} style={{ minWidth: 60 }} />
      ) : actionLabel && onAction ? (
        <GhostButton isDark={isDark} label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
};
