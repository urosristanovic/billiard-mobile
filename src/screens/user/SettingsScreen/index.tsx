import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { DangerButton } from '@/components/common/buttons';
import { useConfirmDialog } from '@/components/common/dialog';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { typography, spacing, radius } from '@/constants/theme';
import { useAuthMutations } from '@/features/auth/useAuthMutations';
import { useTheme } from '@/hooks/useTheme';
import { API_CONFIG } from '@/config/api';
import type { HomeStackParamList } from '@/navigation/AppNavigator';

const WEB_BASE_URL = (
  process.env.EXPO_PUBLIC_WEB_BASE_URL ?? API_CONFIG.baseURL
).replace(/\/$/, '');

type Props = NativeStackScreenProps<HomeStackParamList, 'Settings'>;

type SettingsItem = {
  key: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  iconColor: string;
  iconBg: string;
  title: string;
  description?: string;
  onPress: () => void;
};

const SettingsScreen = ({ navigation }: Props) => {
  const { t } = useTranslation('common');
  const { t: tAuth } = useTranslation('auth');
  const { isDark, tk } = useTheme();
  const { confirm } = useConfirmDialog();
  const { logout } = useAuthMutations();

  const openWebPath = async (path: string) => {
    const url = `${WEB_BASE_URL}${path}`;
    try {
      await Linking.openURL(url);
    } catch {
      // Ignore errors; opening URLs can fail on emulators without browsers.
    }
  };

  const disciplinesDesc = [
    t('disciplines.8ball'),
    t('disciplines.9ball'),
    t('disciplines.10ball'),
    t('disciplines.straightPool'),
    t('disciplines.snooker'),
  ].join(', ');

  const menuItems: SettingsItem[] = [
    {
      key: 'accountSettings',
      icon: 'user',
      iconColor: tk.primary[400],
      iconBg: `${tk.primary[500]}1A`,
      title: tAuth('settings.accountSettings'),
      description: tAuth('settings.accountSettingsDesc'),
      onPress: () => navigation.navigate('Profile'),
    },
    {
      key: 'sendFeedback',
      icon: 'message-circle',
      iconColor: '#f472b6',
      iconBg: 'rgba(244,114,182,0.12)',
      title: tAuth('settings.sendFeedback'),
      description: tAuth('settings.sendFeedbackDesc'),
      onPress: () => navigation.navigate('Feedback'),
    },
    {
      key: 'rules',
      icon: 'book-open',
      iconColor: '#60a5fa',
      iconBg: 'rgba(96,165,250,0.12)',
      title: tAuth('settings.rules'),
      description: disciplinesDesc,
      onPress: () => {
        void openWebPath('/rules');
      },
    },
    {
      key: 'howRatingsWork',
      icon: 'bar-chart-2',
      iconColor: '#34d399',
      iconBg: 'rgba(52,211,153,0.12)',
      title: tAuth('settings.howRatingsWork'),
      description: tAuth('settings.howRatingsWorkDesc'),
      onPress: () => {
        void openWebPath('/how-ratings-work');
      },
    },
    {
      key: 'terms',
      icon: 'file-text',
      iconColor: tk.text.muted,
      iconBg: 'rgba(255,255,255,0.06)',
      title: tAuth('settings.terms'),
      onPress: () => {
        void openWebPath('/terms');
      },
    },
    {
      key: 'privacy',
      icon: 'shield',
      iconColor: tk.text.muted,
      iconBg: 'rgba(255,255,255,0.06)',
      title: tAuth('settings.privacy'),
      onPress: () => {
        void openWebPath('/privacy');
      },
    },
  ];

  const renderItem = (item: SettingsItem) => (
    <TouchableOpacity
      key={item.key}
      onPress={item.onPress}
      activeOpacity={0.75}
      style={[
        styles.card,
        {
          backgroundColor: tk.surface.default,
          borderColor: tk.border.default,
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
        <Feather name={item.icon} size={20} color={item.iconColor} />
      </View>

      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, { color: tk.text.primary }]}>
          {item.title}
        </Text>
        {item.description ? (
          <Text
            style={[styles.cardDesc, { color: tk.text.muted }]}
            numberOfLines={1}
          >
            {item.description}
          </Text>
        ) : null}
      </View>

      <Feather name='chevron-right' size={18} color={tk.text.muted} />
    </TouchableOpacity>
  );

  return (
    <ScreenLayout isDark={isDark}>
      <ScreenHeader
        title={tAuth('settings.title')}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.list}>{menuItems.map(renderItem)}</View>

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
      </ScrollView>
    </ScreenLayout>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  list: {
    gap: spacing[2],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
  },
  cardDesc: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    marginTop: 1,
  },
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    paddingTop: spacing[4],
  },
});
