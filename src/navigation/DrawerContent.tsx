import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import { DangerButton } from '@/components/common/buttons';
import { useConfirmDialog } from '@/components/common/dialog';
import { typography, spacing, radius } from '@/constants/theme';
import { useAuth } from '@/features/auth/useAuth';
import { useAuthMutations } from '@/features/auth/useAuthMutations';
import { useTheme } from '@/hooks/useTheme';
import { API_CONFIG } from '@/config/api';

const WEB_BASE_URL = (process.env.EXPO_PUBLIC_WEB_BASE_URL ?? API_CONFIG.baseURL).replace(
  /\/$/,
  '',
);

type DrawerAction = {
  key: 'profile' | 'rules' | 'howRatingsWork' | 'sendFeedback' | 'terms' | 'privacy';
  onPress: () => void;
};

/** Gold / yellow emphasis (matches brand primary — championship gold). */
const ACCENT_MENU_KEYS = new Set<DrawerAction['key']>([
  'rules',
  'howRatingsWork',
  'sendFeedback',
]);

export const AppDrawerContent = (props: DrawerContentComponentProps) => {
  const { navigation } = props;
  const { t } = useTranslation('common');
  const { t: tAuth } = useTranslation('auth');
  const { isDark, tk } = useTheme();
  const { confirm } = useConfirmDialog();
  const { user } = useAuth();
  const { logout } = useAuthMutations();

  const initials = (
    user?.displayName?.slice(0, 2) ||
    user?.username?.slice(0, 2) ||
    'U'
  ).toUpperCase();

  const openWebPath = async (path: string) => {
    const url = `${WEB_BASE_URL}${path}`;
    try {
      await Linking.openURL(url);
    } catch {
      // Ignore errors; opening URLs can fail on emulators without browsers.
    }
  };

  const profileSection: DrawerAction[] = [
    {
      key: 'profile',
      onPress: () =>
        navigation.navigate('MainTabs', {
          screen: 'Home',
          params: { screen: 'Profile' },
        }),
    },
  ];

  const helpSection: DrawerAction[] = [
    {
      key: 'rules',
      onPress: () => {
        void openWebPath('/rules');
      },
    },
    {
      key: 'howRatingsWork',
      onPress: () => {
        void openWebPath('/how-ratings-work');
      },
    },
    {
      key: 'sendFeedback',
      onPress: () =>
        navigation.navigate('MainTabs', {
          screen: 'Home',
          params: { screen: 'Feedback' },
        }),
    },
  ];

  const legalSection: DrawerAction[] = [
    {
      key: 'terms',
      onPress: () => {
        void openWebPath('/terms');
      },
    },
    {
      key: 'privacy',
      onPress: () => {
        void openWebPath('/privacy');
      },
    },
  ];

  const menuSections: DrawerAction[][] = [profileSection, helpSection, legalSection];

  const renderMenuItem = (action: DrawerAction) => {
    const accent = ACCENT_MENU_KEYS.has(action.key);
    return (
      <TouchableOpacity
        key={action.key}
        onPress={() => {
          navigation.closeDrawer();
          action.onPress();
        }}
        style={[
          styles.menuItem,
          {
            borderColor: accent ? tk.primary[600] : tk.border.default,
            backgroundColor: tk.surface.raised,
          },
        ]}
        activeOpacity={0.75}
      >
        <Text
          style={[
            styles.menuText,
            { color: accent ? tk.primary[400] : tk.text.primary },
          ]}
        >
          {tAuth(`drawer.${action.key}`)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[
        styles.scrollContent,
        { backgroundColor: tk.background.primary },
      ]}
    >
      <View style={[styles.container, { backgroundColor: tk.background.primary }]}>
        <View style={[styles.header, { borderBottomColor: tk.border.default }]}>
          <View
            style={[
              styles.avatarCircle,
              { backgroundColor: tk.background.secondary, borderColor: tk.primary[500] },
            ]}
          >
            <Text style={[styles.avatarText, { color: tk.primary[300] }]}>{initials}</Text>
          </View>
          <View style={styles.userMeta}>
            <Text style={[styles.displayName, { color: tk.text.primary }]}>
              {user?.displayName ?? ''}
            </Text>
            <Text style={[styles.username, { color: tk.text.muted }]}>
              @{user?.username ?? ''}
            </Text>
          </View>
        </View>

        <View style={styles.menu}>
          {menuSections.map((section, sectionIndex) => (
            <View key={sectionIndex}>
              {sectionIndex > 0 ? (
                <View
                  style={[
                    styles.menuDivider,
                    { backgroundColor: tk.border.default },
                  ]}
                  accessibilityRole="none"
                />
              ) : null}
              <View style={styles.menuGroup}>
                {section.map(renderMenuItem)}
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.footer, { borderTopColor: tk.border.default }]}>
          <DangerButton
            label={tAuth('logout.button')}
            onPress={() => {
              confirm({
                title: tAuth('logout.title'),
                message: tAuth('logout.confirm'),
                cancelLabel: t('cancel'),
                confirmLabel: tAuth('logout.button'),
                variant: 'destructive',
                onConfirm: () => logout.mutate(),
              });
            }}
            loading={logout.isPending}
            isDark={isDark}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.size.base,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  userMeta: {
    flex: 1,
    gap: 2,
  },
  displayName: {
    fontSize: typography.size.lg,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  username: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  menu: {
    marginTop: spacing[4],
  },
  menuGroup: {
    gap: spacing[2],
  },
  menuDivider: {
    height: 1,
    marginVertical: spacing[3],
  },
  menuItem: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
  },
  menuText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    paddingTop: spacing[4],
  },
});
