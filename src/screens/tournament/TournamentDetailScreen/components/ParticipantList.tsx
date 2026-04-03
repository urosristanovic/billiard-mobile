import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing, radius } from '@/constants/theme';
import type {
  TournamentParticipant,
  TournamentRequest,
} from '@/types/tournament';

interface ParticipantListProps {
  participants: TournamentParticipant[];
  maxParticipants: number;
  pendingInvitations?: TournamentRequest[];
  isDark?: boolean;
}

export const ParticipantList = ({
  participants,
  maxParticipants,
  pendingInvitations = [],
  isDark = false,
}: ParticipantListProps) => {
  const { t } = useTranslation('tournaments');
  const tk = isDark ? theme.dark : theme.light;

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: tk.text.secondary }]}>
        {t('detail.participants')} —{' '}
        {t('detail.participantCount', {
          count: participants.length,
          max: maxParticipants,
        })}
      </Text>
      {participants.map((p, idx) => (
        <View
          key={p.id}
          style={[styles.row, { borderBottomColor: tk.border.subtle }]}
        >
          {p.seed !== null ? (
            <Text style={[styles.seed, { color: tk.text.muted }]}>
              #{p.seed}
            </Text>
          ) : (
            <Text style={[styles.seed, { color: tk.text.muted }]}>
              {idx + 1}.
            </Text>
          )}
          <View
            style={[styles.avatar, { backgroundColor: tk.surface.overlay }]}
          >
            <Text style={[styles.avatarText, { color: tk.primary[400] }]}>
              {(p.profile.displayName || p.profile.username)[0]?.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.name, { color: tk.text.primary }]}>
            {p.profile.displayName || p.profile.username}
          </Text>
        </View>
      ))}
      {pendingInvitations.map(inv => (
        <View
          key={inv.id}
          style={[styles.row, { borderBottomColor: tk.border.subtle }]}
        >
          <Text style={[styles.seed, { color: tk.text.muted }]}>—</Text>
          <View
            style={[
              styles.avatar,
              { backgroundColor: tk.surface.overlay, opacity: 0.6 },
            ]}
          >
            <Text style={[styles.avatarText, { color: tk.primary[400] }]}>
              {(inv.profile.displayName ||
                inv.profile.username)[0]?.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.name, { color: tk.text.muted }]}>
            {inv.profile.displayName || inv.profile.username}
          </Text>
          <View
            style={[
              styles.invitedBadge,
              { backgroundColor: tk.surface.overlay },
            ]}
          >
            <Text style={[styles.invitedBadgeText, { color: tk.primary[400] }]}>
              {t('detail.invitedBadge')}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  header: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing[2],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    gap: spacing[2],
  },
  seed: {
    width: 28,
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textAlign: 'right',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.display,
  },
  name: {
    flex: 1,
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodyMedium,
  },
  invitedBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  invitedBadgeText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
