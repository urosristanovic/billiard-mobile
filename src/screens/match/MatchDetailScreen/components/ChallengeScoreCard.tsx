import { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '@/components/common/buttons';
import { theme, typography, spacing, radius, iconSize } from '@/constants/theme';
import { scale } from '@/utils/scale';
import { useTheme } from '@/hooks/useTheme';
import type { Match } from '@/types/match';
import { styles as sharedStyles } from '../styles';

interface ScoreAdjusterProps {
  score: number;
  isWinner: boolean;
  playerName: string;
  tk: (typeof theme)[keyof typeof theme];
  onAdjust: (delta: number) => void;
}

const ScoreAdjuster = ({
  score,
  isWinner,
  playerName,
  tk,
  onAdjust,
}: ScoreAdjusterProps) => (
  <View
    style={[
      sharedStyles.challengeScoreBlock,
      {
        backgroundColor: tk.surface.raised,
        borderColor: isWinner ? tk.primary[600] : tk.border.default,
      },
    ]}
  >
    <Text style={[sharedStyles.challengeScoreValue, { color: tk.primary[600] }]}>
      {score}
    </Text>

    <View style={sharedStyles.challengeAdjRow}>
      <TouchableOpacity
        onPress={() => onAdjust(-1)}
        activeOpacity={0.8}
        style={[
          sharedStyles.challengeAdjBtn,
          {
            borderColor: tk.border.default,
            backgroundColor: tk.background.secondary,
          },
        ]}
        accessibilityRole='button'
        accessibilityLabel={`${playerName} minus`}
      >
        <Feather name='minus' size={iconSize.md} color={tk.text.secondary} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onAdjust(1)}
        activeOpacity={0.8}
        style={[
          sharedStyles.challengeAdjBtn,
          {
            borderColor: tk.border.default,
            backgroundColor: tk.background.secondary,
          },
        ]}
        accessibilityRole='button'
        accessibilityLabel={`${playerName} plus`}
      >
        <Feather name='plus' size={iconSize.md} color={tk.text.secondary} />
      </TouchableOpacity>
    </View>
  </View>
);

interface ChallengeScoreCardProps {
  match: Match;
  myUserId: string;
  raceTo: number | null;
  isSubmitting: boolean;
  onRecord: (input: {
    myScore: number;
    opponentScore: number;
    myBeers: number;
    opponentBeers: number;
  }) => void;
}

export const ChallengeScoreCard = ({
  match,
  myUserId,
  raceTo,
  isSubmitting,
  onRecord,
}: ChallengeScoreCardProps) => {
  const { t } = useTranslation('matches');
  const { isDark, tk } = useTheme();

  const [firstPlayer, secondPlayer] = match.players;
  const me = match.players.find(p => p.userId === myUserId) ?? firstPlayer;
  const opponent =
    match.players.find(p => p.userId !== myUserId) ?? secondPlayer;

  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [myBeers, setMyBeers] = useState(0);
  const [opponentBeers, setOpponentBeers] = useState(0);

  const hasTie = myScore === opponentScore;

  const winnerSide = useMemo(() => {
    if (hasTie) return null;
    return myScore > opponentScore ? 'my' : 'opponent';
  }, [myScore, opponentScore, hasTie]);

  const adjust = (side: 'my' | 'opponent', delta: number) => {
    if (side === 'my') {
      setMyScore(v =>
        Math.max(0, raceTo != null ? Math.min(raceTo, v + delta) : v + delta),
      );
    } else {
      setOpponentScore(v =>
        Math.max(0, raceTo != null ? Math.min(raceTo, v + delta) : v + delta),
      );
    }
  };

  if (!me || !opponent) return null;

  const renderFighterInfo = (
    player: Match['players'][number],
    align: 'left' | 'right',
  ) => {
    const isMe = player.userId === myUserId;
    return (
      <>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: tk.background.secondary,
              borderColor: tk.primary[600],
            },
          ]}
        >
          <Text style={[styles.avatarText, { color: tk.primary[600] }]}>
            {player.profile.displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text
          style={[styles.name, { color: tk.text.primary, textAlign: align }]}
        >
          {isMe ? t('you') : player.profile.displayName}
        </Text>
        <Text
          style={[
            styles.username,
            { color: tk.text.muted, textAlign: align },
          ]}
        >
          @{player.profile.username}
        </Text>
      </>
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
      <View style={styles.playersRow}>
        <View style={styles.fighterCol}>
          {renderFighterInfo(me, 'left')}
          <ScoreAdjuster
            score={myScore}
            isWinner={winnerSide === 'my'}
            playerName={t('create.myScore')}
            tk={tk}
            onAdjust={delta => adjust('my', delta)}
          />
        </View>

        <View style={styles.vsWrap}>
          <Text style={[styles.vs, { color: tk.primary[600] }]}>
            {t('detail.vs')}
          </Text>
        </View>

        <View style={[styles.fighterCol, styles.fighterColRight]}>
          {renderFighterInfo(opponent, 'right')}
          <ScoreAdjuster
            score={opponentScore}
            isWinner={winnerSide === 'opponent'}
            playerName={opponent.profile.displayName}
            tk={tk}
            onAdjust={delta => adjust('opponent', delta)}
          />
        </View>
      </View>

      <View style={sharedStyles.challengeBeerSection}>
        {[
          {
            id: 'my',
            label: t('beers.myBeers'),
            value: myBeers,
            onDec: () => setMyBeers(prev => Math.max(0, prev - 1)),
            onInc: () => setMyBeers(prev => prev + 1),
          },
          {
            id: 'opponent',
            label: opponent.profile.displayName,
            value: opponentBeers,
            onDec: () => setOpponentBeers(prev => Math.max(0, prev - 1)),
            onInc: () => setOpponentBeers(prev => prev + 1),
          },
        ].map(item => (
          <View key={item.id} style={sharedStyles.challengeBeerRow}>
            <View
              style={[
                sharedStyles.challengeBeerField,
                {
                  borderColor: tk.border.subtle,
                  backgroundColor: tk.surface.default,
                },
              ]}
            >
              <View style={styles.beerLabelContent}>
                <MaterialCommunityIcons
                  name='beer-outline'
                  size={iconSize.sm}
                  color={tk.text.secondary}
                />
                <Text
                  style={[
                    sharedStyles.challengeBeerLabel,
                    { color: tk.text.secondary },
                  ]}
                >
                  {item.label}
                </Text>
              </View>
              <View style={sharedStyles.challengeBeerControls}>
                <TouchableOpacity
                  onPress={item.onDec}
                  activeOpacity={0.8}
                  style={[
                    sharedStyles.challengeBeerAdjustButton,
                    {
                      borderColor: tk.border.default,
                      backgroundColor: tk.background.secondary,
                    },
                  ]}
                >
                  <Feather name='minus' size={iconSize.sm} color={tk.text.secondary} />
                </TouchableOpacity>
                <Text
                  style={[
                    sharedStyles.challengeBeerValue,
                    { color: tk.text.primary },
                  ]}
                >
                  {item.value}
                </Text>
                <TouchableOpacity
                  onPress={item.onInc}
                  activeOpacity={0.8}
                  style={[
                    sharedStyles.challengeBeerAdjustButton,
                    {
                      borderColor: tk.border.default,
                      backgroundColor: tk.background.secondary,
                    },
                  ]}
                >
                  <Feather name='plus' size={iconSize.sm} color={tk.text.secondary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      <PrimaryButton
        label={t('detail.recordMatchButton')}
        onPress={() =>
          onRecord({ myScore, opponentScore, myBeers, opponentBeers })
        }
        loading={isSubmitting}
        disabled={hasTie}
        isDark={isDark}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderRadius: radius['4xl'],
    borderWidth: 0.5,
    padding: spacing[4],
    gap: spacing[3],
  },
  playersRow: {
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
    width: scale(52),
    height: scale(52),
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
    marginBottom: spacing[3],
  },
  beerLabelContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
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
