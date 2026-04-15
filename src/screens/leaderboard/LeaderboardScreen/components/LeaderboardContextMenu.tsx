import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, radius, iconSize } from '@/constants/theme';
import type { CustomLeaderboard } from '@/types/group';

export type ContextMenuAction =
  | 'open'
  | 'createNew'
  | 'seeDetails'
  | 'edit'
  | 'setDefault'
  | 'leave';

export interface MenuAnchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ActionItem {
  key: ContextMenuAction;
  icon: string;
  label: string;
  destructive?: boolean;
}

const GAP = 6;
const H_PADDING = spacing[4];

interface Props {
  visible: boolean;
  leaderboard: CustomLeaderboard | null;
  anchor: MenuAnchor | null;
  isDefault?: boolean;
  onAction: (action: ContextMenuAction) => void;
  onClose: () => void;
}

export const LeaderboardContextMenu = ({
  visible,
  leaderboard,
  anchor,
  isDefault = false,
  onAction,
  onClose,
}: Props) => {
  const { t } = useTranslation('leaderboard');
  const { isDark, tk } = useTheme();

  if (!leaderboard) return null;

  const isCreator = leaderboard.isCreator === true;

  const actions: ActionItem[] = [
    { key: 'createNew', icon: 'plus-circle', label: t('contextMenu.createNew') },
    { key: 'seeDetails', icon: 'info', label: t('contextMenu.seeDetails') },
    ...(!isDefault
      ? [{ key: 'setDefault' as const, icon: 'star', label: t('contextMenu.setDefault') }]
      : []),
    ...(!isCreator
      ? [{ key: 'leave' as const, icon: 'log-out', label: t('contextMenu.leave'), destructive: true }]
      : []),
  ];

  const cardTop = anchor ? anchor.y + anchor.height + GAP : 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      <View
        style={[
          styles.card,
          {
            top: cardTop,
            right: H_PADDING,
            backgroundColor: tk.surface.raised,
            borderColor: tk.border.default,
            shadowColor: isDark ? '#000' : '#00000033',
          },
        ]}
        pointerEvents='box-none'
      >
        {/* Actions */}
        {actions.map((action, index) => (
          <Pressable
            key={action.key}
            onPress={() => {
              onClose();
              onAction(action.key);
            }}
            style={({ pressed }) => [
              styles.actionRow,
              index < actions.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: tk.border.default,
              },
              pressed && { opacity: 0.6 },
            ]}
          >
            <Feather
              name={action.icon as any}
              size={iconSize.md}
              color={action.destructive ? tk.error.default : tk.text.primary}
            />
            <Text
              style={[
                styles.actionLabel,
                { color: action.destructive ? tk.error.default : tk.text.primary },
              ]}
            >
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
  },
  actionLabel: {
    fontSize: typography.size.lg,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.medium,
  },
});
