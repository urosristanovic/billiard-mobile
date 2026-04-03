import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { spacing, radius } from '@/constants/theme';
import { AppLogo } from '../AppLogo';

interface AppHeaderProps {
  onBellPress?: () => void;
  hasNotifications?: boolean;
}

export const AppHeader = ({
  onBellPress,
  hasNotifications = false,
}: AppHeaderProps) => {
  const { tk } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: tk.background.primary,
          borderBottomColor: tk.border.subtle,
        },
      ]}
    >
      <AppLogo />
      {/* <TouchableOpacity onPress={onBellPress} style={styles.bellWrap}>
        <Feather name='bell' size={24} color={tk.text.secondary} />
        {hasNotifications && (
          <View
            style={[styles.bellDot, { borderColor: tk.background.primary }]}
          />
        )}
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
  },
  bellWrap: {
    position: 'relative',
    padding: 2,
  },
  bellDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: '#F59E0B',
    borderWidth: 2,
  },
});
