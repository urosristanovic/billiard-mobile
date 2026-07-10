import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { LoadingState, EmptyState } from '@/components/common/states';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, radius } from '@/constants/theme';
import { scale } from '@/utils/scale';
import { useNotifications, useMarkNotificationRead } from '@/features/notifications/useNotifications';
import { navigationRef } from '@/navigation/navigationService';
import type { RootStackParamList } from '@/navigation/navigationService';
import type { AppNotification } from '@/types/notification';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const NotificationsScreen = ({ navigation }: Props) => {
  const { t } = useTranslation('notifications');
  const { isDark, tk } = useTheme();

  const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 1) return t('timeAgo.justNow');
    if (minutes < 60) return t('timeAgo.minutesAgo', { count: minutes });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t('timeAgo.hoursAgo', { count: hours });
    return t('timeAgo.daysAgo', { count: Math.floor(hours / 24) });
  };
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useNotifications();
  const markRead = useMarkNotificationRead();

  const notifications: AppNotification[] =
    data?.pages.flatMap(p => p.data) ?? [];

  const handlePress = (item: AppNotification) => {
    if (!item.readAt) {
      markRead.mutate(item.id);
    }
    const { screen, params } = item.data as {
      screen?: string;
      params?: Record<string, unknown>;
    };
    if (screen && navigationRef.isReady()) {
      navigation.goBack();
      // @ts-ignore – dynamic screen from push payload
      navigationRef.navigate(screen, params);
    }
  };

  const renderItem = ({ item }: { item: AppNotification }) => (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => handlePress(item)}
      style={[
        styles.item,
        {
          backgroundColor: item.readAt
            ? tk.surface.default
            : tk.surface.elevated,
          borderColor: tk.border.default,
        },
      ]}
    >
      {!item.readAt && (
        <View style={[styles.unreadDot, { backgroundColor: tk.primary[400] }]} />
      )}
      <View style={styles.itemBody}>
        <Text
          style={[
            styles.itemTitle,
            {
              color: tk.text.primary,
              fontWeight: item.readAt
                ? typography.weight.regular
                : typography.weight.semibold,
            },
          ]}
          numberOfLines={1}
        >
          {t(`types.${item.type}.title`, item.title)}
        </Text>
        <Text
          style={[styles.itemBody2, { color: tk.text.secondary }]}
          numberOfLines={2}
        >
          {t(`types.${item.type}.body`, item.body)}
        </Text>
        <Text style={[styles.itemTime, { color: tk.text.muted }]}>
          {timeAgo(item.createdAt)}
        </Text>
      </View>
      <Feather name='chevron-right' size={scale(16)} color={tk.text.muted} />
    </TouchableOpacity>
  );

  return (
    <ScreenLayout isDark={isDark}>
      <ScreenHeader
        title={t('screen.title')}
        onBack={() => navigation.goBack()}
      />

      {isLoading ? (
        <LoadingState isDark={isDark} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={
            notifications.length === 0
              ? styles.emptyContainer
              : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <EmptyState
              title={t('screen.empty')}
              description={t('screen.emptyDesc')}
              isDark={isDark}
            />
          }
        />
      )}
    </ScreenLayout>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    gap: spacing[2],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  unreadDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    flexShrink: 0,
  },
  itemBody: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: typography.size.base,
  },
  itemBody2: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  itemTime: {
    fontSize: typography.size.xs,
    marginTop: 2,
  },
});
