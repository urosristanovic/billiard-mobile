import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import { theme, typography, spacing, radius, shadows } from '@/constants/theme';
import type { TournamentMatch } from '@/types/tournament';

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
      <View style={[styles.backdrop, { backgroundColor: tk.background.overlay }]}>
        <View
          style={[
            styles.dialog,
            { backgroundColor: tk.surface.default, borderColor: tk.primary[700] },
            shadows.lg,
          ]}
        >
          <Text style={[styles.title, { color: tk.text.primary }]}>{title}</Text>

          {/* Player name labels */}
          <View style={styles.labelsRow}>
            <Text
              numberOfLines={1}
              style={[styles.playerLabel, styles.playerLabelLeft, { color: tk.text.secondary }]}
            >
              {homeName}
            </Text>
            <View style={styles.vsSpacer} />
            <Text
              numberOfLines={1}
              style={[styles.playerLabel, styles.playerLabelRight, { color: tk.text.secondary }]}
            >
              {awayName}
            </Text>
          </View>

          {/* Score row */}
          <View style={styles.scoreRow}>
            {/* Home */}
            <View style={styles.scoreField}>
              <View
                style={[
                  styles.scoreBlock,
                  {
                    backgroundColor: tk.surface.raised,
                    borderColor:
                      winnerSide === 'home' ? tk.primary[500] : tk.primary[700],
                  },
                  winnerSide === 'home' && styles.scoreBlockWinner,
                ]}
              >
                <TouchableOpacity
                  onPress={() => adjust('home', -1)}
                  activeOpacity={0.8}
                  style={[
                    styles.adjBtn,
                    { borderColor: tk.border.default, backgroundColor: tk.background.secondary },
                  ]}
                  accessibilityRole='button'
                  accessibilityLabel={`${homeName} minus`}
                >
                  <Text style={[styles.adjText, { color: tk.text.secondary }]}>-</Text>
                </TouchableOpacity>

                <Text style={[styles.scoreValue, { color: tk.primary[300] }]}>
                  {homeScore}
                </Text>

                <TouchableOpacity
                  onPress={() => adjust('home', 1)}
                  activeOpacity={0.8}
                  style={[
                    styles.adjBtn,
                    { borderColor: tk.border.default, backgroundColor: tk.background.secondary },
                  ]}
                  accessibilityRole='button'
                  accessibilityLabel={`${homeName} plus`}
                >
                  <Text style={[styles.adjText, { color: tk.text.secondary }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* vs */}
            <View style={styles.vsWrap}>
              <Text style={[styles.vsText, { color: tk.text.muted }]}>vs</Text>
            </View>

            {/* Away */}
            <View style={styles.scoreField}>
              <View
                style={[
                  styles.scoreBlock,
                  {
                    backgroundColor: tk.surface.raised,
                    borderColor:
                      winnerSide === 'away' ? tk.primary[500] : tk.primary[700],
                  },
                  winnerSide === 'away' && styles.scoreBlockWinner,
                ]}
              >
                <TouchableOpacity
                  onPress={() => adjust('away', -1)}
                  activeOpacity={0.8}
                  style={[
                    styles.adjBtn,
                    { borderColor: tk.border.default, backgroundColor: tk.background.secondary },
                  ]}
                  accessibilityRole='button'
                  accessibilityLabel={`${awayName} minus`}
                >
                  <Text style={[styles.adjText, { color: tk.text.secondary }]}>-</Text>
                </TouchableOpacity>

                <Text style={[styles.scoreValue, { color: tk.primary[300] }]}>
                  {awayScore}
                </Text>

                <TouchableOpacity
                  onPress={() => adjust('away', 1)}
                  activeOpacity={0.8}
                  style={[
                    styles.adjBtn,
                    { borderColor: tk.border.default, backgroundColor: tk.background.secondary },
                  ]}
                  accessibilityRole='button'
                  accessibilityLabel={`${awayName} plus`}
                >
                  <Text style={[styles.adjText, { color: tk.text.secondary }]}>+</Text>
                </TouchableOpacity>
              </View>
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
    borderRadius: radius.xl,
    borderWidth: 2,
    padding: spacing[5],
    gap: spacing[4],
  },
  title: {
    fontSize: typography.size.lg,
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
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  playerLabelLeft: {},
  playerLabelRight: {
    textAlign: 'right',
  },
  vsSpacer: {
    width: 28,
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
    borderRadius: radius.lg,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[2],
  },
  scoreBlockWinner: {
    borderWidth: 2,
  },
  adjBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjText: {
    fontFamily: typography.family.heading,
    fontSize: typography.size.lg,
    lineHeight: typography.size.lg * 1.1,
  },
  scoreValue: {
    fontFamily: typography.family.display,
    fontSize: typography.size['4xl'],
    lineHeight: typography.size['4xl'] * 1.15,
    textAlignVertical: 'center',
    paddingTop: 3,
  },
  vsWrap: {
    width: 28,
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
  },
  action: {
    flex: 1,
  },
});
