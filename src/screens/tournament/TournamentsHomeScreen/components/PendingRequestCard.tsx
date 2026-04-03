import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing, radius } from '@/constants/theme';
import { TOURNAMENT_FORMAT_LABELS } from '@/types/tournament';
import { DISCIPLINE_LABELS } from '@/types/match';
import type { TournamentRequest } from '@/types/tournament';

interface PendingRequestCardProps {
  request: TournamentRequest;
  onPress: () => void;
  isDark?: boolean;
}

export const PendingRequestCard = ({
  request,
  onPress,
  isDark = false,
}: PendingRequestCardProps) => {
  const { t } = useTranslation('tournaments');
  const tk = isDark ? theme.dark : theme.light;

  const isIncoming = request.direction === 'invitation';
  const tournament = request.tournament;
  const accentColor = isIncoming ? tk.primary[600] : tk.border.default;
  const label = isIncoming
    ? t('home.pending.invitation')
    : t('home.pending.request');

  const formattedDate = tournament
    ? new Date(tournament.scheduledAt).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole='button'
      style={[
        styles.card,
        {
          backgroundColor: tk.surface.default,
          borderColor: tk.border.default,
        },
      ]}
    >
      {/* Left accent stripe */}
      <View style={[styles.accent, { backgroundColor: accentColor }]} />

      <View style={styles.body}>
        {/* Top row: badge(s) + chevron */}
        <View style={styles.topRow}>
          <View style={styles.badges}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: tk.surface.overlay,
                  borderColor: isIncoming ? tk.primary[500] : tk.border.default,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: isIncoming ? tk.primary[500] : tk.text.secondary },
                ]}
              >
                {label}
              </Text>
            </View>
            {tournament?.isRated && (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: tk.surface.overlay,
                    borderColor: tk.primary[500],
                  },
                ]}
              >
                <Text style={[styles.badgeText, { color: tk.primary[500] }]}>
                  {t('ratedBadge')}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.chevron, { color: tk.text.muted }]}>›</Text>
        </View>

        {/* Tournament name */}
        <Text
          style={[styles.name, { color: tk.text.primary }]}
          numberOfLines={2}
        >
          {tournament?.name ?? '—'}
        </Text>

        {/* Discipline · Format */}
        {tournament && (
          <Text style={[styles.sub, { color: tk.text.secondary }]}>
            {DISCIPLINE_LABELS[tournament.discipline]}
            {'  ·  '}
            {TOURNAMENT_FORMAT_LABELS[tournament.format]}
          </Text>
        )}

        {/* Meta row: date · location */}
        {tournament && (
          <View style={styles.metaRow}>
            {formattedDate && (
              <View style={styles.metaItem}>
                <Feather name='calendar' size={18} color={tk.text.muted} />
                <Text style={[styles.meta, { color: tk.text.muted }]}>
                  {formattedDate}
                </Text>
              </View>
            )}
            {tournament.location && (
              <View style={styles.metaItem}>
                <Feather name='map-pin' size={14} color={tk.text.muted} />
                <Text style={[styles.meta, { color: tk.text.muted }]}>
                  {tournament.location}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Footer: organizer + spots */}
        {tournament && (
          <View style={styles.footer}>
            <Text style={[styles.organizer, { color: tk.text.muted }]}>
              {isIncoming
                ? `${t('detail.organizer')}: `
                : `${t('detail.organizer')}: `}
              <Text
                style={[styles.organizerName, { color: tk.text.secondary }]}
              >
                {tournament.organizerProfile.displayName ||
                  tournament.organizerProfile.username}
              </Text>
            </Text>
            <View
              style={[
                styles.spotsBadge,
                { backgroundColor: tk.surface.overlay },
              ]}
            >
              <Feather name='users' size={14} color={tk.text.muted} />
              <Text style={[styles.spotsText, { color: tk.text.muted }]}>
                {tournament.participantCount}/{tournament.maxParticipants}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accent: {
    width: 4,
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
  },
  body: {
    flex: 1,
    padding: spacing[3],
    gap: spacing[2],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  badge: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  badgeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
  },
  chevron: {
    fontSize: 20,
    fontFamily: typography.family.display,
  },
  name: {
    fontSize: typography.size['2xl'],
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.snug,
    lineHeight: typography.size['2xl'] * 1.2,
    paddingVertical: spacing[2],
  },
  sub: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  meta: {
    fontSize: typography.size.lg,
    fontFamily: typography.family.body,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing[1],
  },
  organizer: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    flex: 1,
  },
  organizerName: {
    fontFamily: typography.family.bodyMedium,
  },
  spotsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    borderRadius: radius.sm,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  spotsText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bodyMedium,
  },
});
