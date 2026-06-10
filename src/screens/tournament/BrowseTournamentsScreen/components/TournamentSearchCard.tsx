import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing, radius, iconSize } from '@/constants/theme';
import { scale } from '@/utils/scale';
import type {
  TournamentSummary,
  TournamentRequestStatus,
} from '@/types/tournament';
import { TOURNAMENT_FORMAT_LABELS } from '@/types/tournament';
import { DISCIPLINE_LABELS } from '@/types/match';

interface TournamentSearchCardProps {
  tournament: TournamentSummary;
  onPress: () => void;
  onRequestSpot: () => void;
  isRequesting?: boolean;
  hasRequested?: boolean;
  myRequestStatus?: TournamentRequestStatus;
  isOrganizer?: boolean;
  isParticipant?: boolean;
  isDark?: boolean;
}

export const TournamentSearchCard = ({
  tournament,
  onPress,
  onRequestSpot,
  isRequesting,
  hasRequested,
  myRequestStatus,
  isOrganizer = false,
  isParticipant = false,
  isDark = false,
}: TournamentSearchCardProps) => {
  const { t } = useTranslation('tournaments');
  const tk = isDark ? theme.dark : theme.light;

  const isFull = tournament.participantCount >= tournament.maxParticipants;

  const isRejected =
    (myRequestStatus === 'rejected' || myRequestStatus === 'cancelled') &&
    !hasRequested;
  const isPending = hasRequested || myRequestStatus === 'pending';
  const isAccepted = myRequestStatus === 'accepted';
  const isDisabled =
    isFull ||
    isRequesting ||
    isPending ||
    isAccepted ||
    isOrganizer ||
    isParticipant;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.card,
        {
          backgroundColor: tk.surface.raised,
          borderColor: tk.border.default,
        },
      ]}
    >
      <View style={styles.info}>
        <View style={styles.nameRow}>
          {!tournament.isRated && (
            <View
              style={[
                styles.ratedBadge,
                { borderColor: tk.border.strong },
              ]}
            >
              <Text
                style={[
                  styles.ratedBadgeText,
                  { color: tk.text.muted },
                ]}
              >
                {t('unratedBadge')}
              </Text>
            </View>
          )}
          <Text
            style={[styles.name, { color: tk.text.primary }]}
            numberOfLines={1}
          >
            {tournament.name}
          </Text>
        </View>
        <Text style={[styles.meta, { color: tk.text.secondary }]}>
          {DISCIPLINE_LABELS[tournament.discipline]} ·{' '}
          {TOURNAMENT_FORMAT_LABELS[tournament.format]}
        </Text>
        {tournament.location ? (
          <View style={styles.locationRow}>
            <Feather name='map-pin' size={iconSize.sm} color={tk.text.muted} />
            <Text
              style={[styles.location, { color: tk.text.muted }]}
              numberOfLines={1}
            >
              {tournament.location}
            </Text>
          </View>
        ) : null}
        <Text
          style={[
            styles.capacity,
            { color: isFull ? tk.error.text : tk.text.secondary },
          ]}
        >
          {isFull
            ? t('browse.full')
            : `${tournament.participantCount} / ${tournament.maxParticipants} ${t('detail.participants')}`}
        </Text>
      </View>

      <TouchableOpacity
        onPress={e => {
          e.stopPropagation?.();
          onRequestSpot();
        }}
        disabled={isDisabled}
        activeOpacity={0.8}
        accessibilityRole='button'
        style={[
          styles.button,
          {
            backgroundColor: tk.surface.raised,
            borderColor: tk.primary[600],
          },
          isDisabled && styles.buttonDisabled,
        ]}
      >
        {isRequesting ? (
          <ActivityIndicator size='small' color={tk.primary[400]} />
        ) : (
          <Text style={[styles.buttonText, { color: tk.primary[500] }]}>
            {isOrganizer
              ? t('browse.organizer')
              : isParticipant || isAccepted
                ? t('browse.joined')
                : isPending
                  ? t('browse.requestSent')
                  : isFull
                    ? t('browse.full')
                    : isRejected
                      ? t('browse.requestAgain')
                      : t('browse.requestButtonShort')}
          </Text>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  info: {
    flex: 1,
    gap: spacing[1],
  },
  name: {
    flex: 1,
    flexShrink: 1,
    fontSize: typography.size.base,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  meta: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  ratedBadge: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing[1] + 2,
    paddingVertical: 2,
  },
  ratedBadgeText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  location: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    flexShrink: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  capacity: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bodyMedium,
  },
  button: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    minWidth: scale(80),
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
