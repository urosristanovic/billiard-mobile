import { useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import { theme, typography, spacing, radius, shadows, iconSize } from '@/constants/theme';
import { scale } from '@/utils/scale';
import type { TournamentMatch } from '@/types/tournament';

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
      styles.scoreBlock,
      {
        backgroundColor: tk.surface.raised,
        borderColor: isWinner ? tk.primary[600] : tk.border.default,
      },
    ]}
  >
    <Text style={[styles.scoreValue, { color: tk.primary[600] }]}>{score}</Text>

    <View style={styles.adjRow}>
      <TouchableOpacity
        onPress={() => onAdjust(-1)}
        activeOpacity={0.8}
        style={[
          styles.adjBtn,
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
          styles.adjBtn,
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

interface RecordScoreModalProps {
  visible: boolean;
  match: TournamentMatch | null;
  isDark?: boolean;
  title: string;
  confirmLabel: string;
  cancelLabel: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (input: { homeScore: number; awayScore: number }) => void;
}

export const RecordScoreModal = ({
  visible,
  match,
  isDark = false,
  title,
  confirmLabel,
  cancelLabel,
  loading = false,
  onClose,
  onConfirm,
}: RecordScoreModalProps) => {
  const tk = isDark ? theme.dark : theme.light;
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  useEffect(() => {
    setHomeScore(match?.homeScore ?? 0);
    setAwayScore(match?.awayScore ?? 0);
  }, [match?.id, match?.homeScore, match?.awayScore]);

  const hasTie = homeScore === awayScore;
  const canSubmit = !hasTie;

  const winnerSide = useMemo(() => {
    if (hasTie) return null;
    return homeScore > awayScore ? 'home' : 'away';
  }, [homeScore, awayScore, hasTie]);

  const adjust = (side: 'home' | 'away', delta: number) => {
    if (side === 'home') setHomeScore(v => Math.max(0, v + delta));
    else setAwayScore(v => Math.max(0, v + delta));
  };

  const submit = () => {
    if (!canSubmit || !match) return;
    onConfirm({ homeScore, awayScore });
  };

  const homeName =
    match?.homeProfile?.displayName || match?.homeProfile?.username || 'TBD';
  const awayName =
    match?.awayProfile?.displayName || match?.awayProfile?.username || 'TBD';

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        style={[styles.backdrop, { backgroundColor: tk.background.overlay }]}
      >
        <View
          style={[
            styles.dialog,
            {
              backgroundColor: tk.surface.default,
              borderColor: tk.primary[600],
            },
            shadows.lg,
          ]}
        >
          <Text style={[styles.title, { color: tk.text.primary }]}>
            {title}
          </Text>

          {/* Player name labels */}
          <View style={styles.labelsRow}>
            <Text
              numberOfLines={1}
              style={[
                styles.playerLabel,
                styles.playerLabelLeft,
                { color: tk.text.secondary },
              ]}
            >
              {homeName}
            </Text>
            <View style={styles.vsSpacer} />
            <Text
              numberOfLines={1}
              style={[
                styles.playerLabel,
                styles.playerLabelRight,
                { color: tk.text.secondary },
              ]}
            >
              {awayName}
            </Text>
          </View>

          {/* Score row */}
          <View style={styles.scoreRow}>
            {/* Home */}
            <View style={styles.scoreField}>
              <ScoreAdjuster
                score={homeScore}
                isWinner={winnerSide === 'home'}
                playerName={homeName}
                tk={tk}
                onAdjust={delta => adjust('home', delta)}
              />
            </View>

            {/* vs */}
            <View style={styles.vsWrap}>
              <Text style={[styles.vsText, { color: tk.text.muted }]}>vs</Text>
            </View>

            {/* Away */}
            <View style={styles.scoreField}>
              <ScoreAdjuster
                score={awayScore}
                isWinner={winnerSide === 'away'}
                playerName={awayName}
                tk={tk}
                onAdjust={delta => adjust('away', delta)}
              />
            </View>
          </View>

          <View style={styles.actions}>
            <SecondaryButton
              label={cancelLabel}
              onPress={onClose}
              isDark={isDark}
              style={styles.action}
            />
            <PrimaryButton
              label={confirmLabel}
              onPress={submit}
              disabled={!canSubmit}
              loading={loading}
              isDark={isDark}
              style={styles.action}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  dialog: {
    borderRadius: radius['4xl'],
    borderWidth: 0.5,
    padding: spacing[6],
    gap: spacing[4],
  },
  title: {
    fontSize: typography.size.xl,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  labelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  playerLabel: {
    flex: 1,
    fontSize: typography.size.lg,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  playerLabelLeft: {},
  playerLabelRight: {
    textAlign: 'right',
  },
  vsSpacer: {
    width: spacing[6],
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  scoreField: {
    flex: 1,
  },
  scoreBlock: {
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    alignItems: 'center',
    gap: spacing[2],
  },
  adjRow: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  adjBtn: {
    width: spacing[12],
    height: spacing[12],
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontFamily: typography.family.display,
    fontSize: typography.size['5xl'],
    lineHeight: typography.size['5xl'] * 1.15,
    textAlignVertical: 'center',
    paddingTop: spacing[1],
  },
  vsWrap: {
    width: scale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.display,
    letterSpacing: 0.8,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[10],
  },
  action: {
    flex: 1,
  },
});
