import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { LoadingState } from '@/components/common/states';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, radius } from '@/constants/theme';
import {
  useNotificationPrefs,
  useUpdateNotificationPref,
} from '@/features/notifications/useNotificationPrefs';
import type { RootStackParamList } from '@/navigation/navigationService';
import type { NotificationCategory, NotificationPref } from '@/types/notification';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationSettings'>;

// Only categories that have active notifications wired up.
// Add 'tournaments' here when Phase 2 is implemented.
// Add 'leaderboards' and 'engagement' when Phase 3 is implemented.
const VISIBLE_CATEGORIES: NotificationCategory[] = ['matches'];

const NotificationSettingsScreen = ({ navigation }: Props) => {
  const { t } = useTranslation('notifications');
  const { isDark, tk } = useTheme();
  const { data: prefs, isLoading } = useNotificationPrefs();
  const updatePref = useUpdateNotificationPref();

  const toggle = (
    pref: NotificationPref,
    channel: 'pushEnabled' | 'inboxEnabled',
    value: boolean,
  ) => {
    updatePref.mutate({ category: pref.category, [channel]: value });
  };

  return (
    <ScreenLayout isDark={isDark}>
      <ScreenHeader
        title={t('settings.title')}
        onBack={() => navigation.goBack()}
      />

      {isLoading ? (
        <LoadingState isDark={isDark} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {(prefs ?? []).filter(p => VISIBLE_CATEGORIES.includes(p.category)).map(pref => (
                <View
                  key={pref.category}
                  style={[
                    styles.card,
                    {
                      backgroundColor: tk.surface.default,
                      borderColor: tk.border.default,
                    },
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: tk.text.primary }]}>
                      {t(`settings.categories.${pref.category}.title`)}
                    </Text>
                    <Text
                      style={[styles.cardDesc, { color: tk.text.muted }]}
                      numberOfLines={2}
                    >
                      {t(`settings.categories.${pref.category}.description`)}
                    </Text>
                  </View>

                  <View style={styles.toggleRow}>
                    <View style={styles.toggleLabel}>
                      <Text style={[styles.toggleTitle, { color: tk.text.secondary }]}>
                        Push
                      </Text>
                    </View>
                    <Switch
                      value={pref.pushEnabled}
                      onValueChange={val => toggle(pref, 'pushEnabled', val)}
                      trackColor={{
                        false: tk.border.subtle,
                        true: tk.primary[500],
                      }}
                      thumbColor={tk.text.onPrimary}
                      disabled={updatePref.isPending}
                    />
                  </View>

                  <View
                    style={[styles.divider, { backgroundColor: tk.border.subtle }]}
                  />

                  <View style={styles.toggleRow}>
                    <View style={styles.toggleLabel}>
                      <Text style={[styles.toggleTitle, { color: tk.text.secondary }]}>
                        In-app inbox
                      </Text>
                    </View>
                    <Switch
                      value={pref.inboxEnabled}
                      onValueChange={val => toggle(pref, 'inboxEnabled', val)}
                      trackColor={{
                        false: tk.border.subtle,
                        true: tk.primary[500],
                      }}
                      thumbColor={tk.text.onPrimary}
                      disabled={updatePref.isPending}
                    />
                  </View>
                </View>
              ))}
          </View>
        </ScrollView>
      )}
    </ScreenLayout>
  );
};

export default NotificationSettingsScreen;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
  },
  cardHeader: {
    gap: 2,
    marginBottom: spacing[3],
  },
  cardTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  cardDesc: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
  },
  toggleLabel: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: typography.size.sm,
  },
  divider: {
    height: 1,
    marginHorizontal: -spacing[4],
  },
});
