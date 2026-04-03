import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing, radius } from '@/constants/theme';
import type { Match } from '@/types/match';

interface ScoreBoardProps {
  match: Match;
  myUserId: string;
  isDark: boolean;
}

export const ScoreBoard = ({ match, myUserId, isDark }: ScoreBoardProps) => {
  const { t } = useTranslation('matches');
  const tk = isDark ? theme.dark : theme.light;
  const me = match.players.find(player => player.userId === myUserId);
  const opponent = match.players.find(player => player.userId !== myUserId);
  const [firstPlayer, secondPlayer] = match.players;
  const left = me ?? firstPlayer;
  const right = opponent ?? secondPlayer;
  if (!left || !right) {
    return null;
  }

  const renderFighter = (
    player: Match['players'][number],
    align: 'left' | 'right',
  ) => {
    const isMe = player.userId === myUserId;
    const isWinner = player.isWinner;

    return (
      <View
        style={[styles.fighterCol, align === 'right' && styles.fighterColRight]}
      >
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: tk.background.secondary,
              borderColor: tk.primary[600],
            },
          ]}
        >
          <Text
            style={[
              styles.avatarText,
              {
                color: tk.primary[600],
              },
            ]}
          >
            {player.profile.displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text
          style={[
            styles.name,
            {
              color: tk.text.primary,
              textAlign: align,
            },
          ]}
        >
          {isMe ? t('you') : player.profile.displayName}
        </Text>
        <Text
          style={[
            styles.username,
            {
              color: tk.text.muted,
              textAlign: align,
            },
          ]}
        >
          @{player.profile.username}
        </Text>
        <Text
          style={[
            styles.score,
            {
              color: isWinner ? tk.primary[600] : tk.text.secondary,
            },
          ]}
        >
          {player.score != null ? player.score : '—'}
        </Text>
        {player.beers > 0 && (
          <View style={styles.beersRow}>
            <MaterialCommunityIcons
              name='beer-outline'
              size={13}
              color={tk.text.muted}
            />
            <Text style={[styles.beers, { color: tk.text.muted }]}>
              {player.beers}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.board,
        {
          backgroundColor: tk.surface.default,
          borderColor: tk.primary[600],
        },
      ]}
    >
      {renderFighter(left, 'left')}
      <View style={styles.vsWrap}>
        <Text style={[styles.vs, { color: tk.primary[600] }]}>
          {t('detail.vs')}
        </Text>
      </View>
      {renderFighter(right, 'right')}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderRadius: radius['4xl'],
    borderWidth: 0.5,
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  fighterCol: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 2,
  },
  fighterColRight: {
    alignItems: 'flex-end',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: spacing[1],
  },
  avatarText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  name: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.bodySemibold,
  },
  username: {
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
  },
  score: {
    fontWeight: typography.weight.bold,
    fontSize: typography.size['5xl'],
    fontFamily: typography.family.display,
    lineHeight: typography.size['5xl'] * 1.1,
    marginTop: spacing[5],
  },
  beersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  beers: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  vsWrap: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: spacing[1],
  },
  vs: {
    fontSize: typography.size.lg,
    fontFamily: typography.family.display,
    letterSpacing: 1,
  },
});
