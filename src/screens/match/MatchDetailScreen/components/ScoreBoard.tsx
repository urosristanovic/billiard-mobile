import { StyleSheet, Text, View } from 'react-native';
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
  const isTie =
    left?.score != null && right?.score != null && left.score === right.score;

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
              borderColor: isTie
                ? tk.info.default
                : isWinner
                  ? tk.primary[500]
                  : tk.error.default,
            },
          ]}
        >
          <Text
            style={[
              styles.avatarText,
              {
                color: isTie
                  ? tk.info.text
                  : isWinner
                    ? tk.primary[300]
                    : tk.error.text,
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
              textAlign: align === 'right' ? 'right' : 'left',
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
              textAlign: align === 'right' ? 'right' : 'left',
            },
          ]}
        >
          @{player.profile.username}
        </Text>
        <Text
          style={[
            styles.score,
            {
              color: isTie
                ? tk.info.default
                : isWinner
                  ? tk.primary[400]
                  : tk.text.secondary,
            },
          ]}
        >
          {player.score != null ? player.score : '—'}
        </Text>
        {player.beers > 0 && (
          <Text style={[styles.beers, { color: tk.text.muted }]}>
            🍺 {player.beers}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.board,
        {
          backgroundColor: tk.surface.raised,
          borderColor: isTie ? tk.info.border : tk.primary[800],
        },
      ]}
    >
      {renderFighter(left, 'left')}
      <View style={styles.vsWrap}>
        <Text
          style={[
            styles.vs,
            { color: isTie ? tk.info.default : tk.primary[300] },
          ]}
        >
          {isTie ? t('tie') : t('detail.vs')}
        </Text>
      </View>
      {renderFighter(right, 'right')}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderRadius: radius.xl,
    borderWidth: 1,
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
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.bodySemibold,
  },
  username: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  score: {
    fontWeight: typography.weight.bold,
    fontSize: typography.size['4xl'],
    fontFamily: typography.family.display,
    lineHeight: typography.size['4xl'] * 1.1,
    marginTop: spacing[1],
  },
  beers: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    marginTop: 2,
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
