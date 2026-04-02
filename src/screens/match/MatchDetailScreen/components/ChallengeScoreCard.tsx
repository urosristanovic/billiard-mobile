import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '@/components/common/buttons';
import { useTheme } from '@/hooks/useTheme';
import { styles } from '../styles';

interface ChallengeScoreCardProps {
  opponentName: string;
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
  opponentName,
  raceTo,
  isSubmitting,
  onRecord,
}: ChallengeScoreCardProps) => {
  const { t } = useTranslation('matches');
  const { isDark, tk } = useTheme();

  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [myBeers, setMyBeers] = useState(0);
  const [opponentBeers, setOpponentBeers] = useState(0);

  const handleIncrement = (field: 'my' | 'opponent') => {
    if (field === 'my') {
      setMyScore(prev =>
        raceTo != null ? Math.min(raceTo, prev + 1) : prev + 1,
      );
    } else {
      setOpponentScore(prev =>
        raceTo != null ? Math.min(raceTo, prev + 1) : prev + 1,
      );
    }
  };

  const handleDecrement = (field: 'my' | 'opponent') => {
    if (field === 'my') {
      setMyScore(prev => Math.max(0, prev - 1));
    } else {
      setOpponentScore(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <View
      style={[
        styles.challengeScoreCard,
        { backgroundColor: tk.surface.raised, borderColor: tk.primary[700] },
      ]}
    >
      <Text style={[styles.challengeScoreTitle, { color: tk.text.secondary }]}>
        {t('detail.recordChallengeScoreTitle')}
      </Text>

      <View style={styles.challengeScoreSection}>
        <View style={styles.challengeScoreLabelsRow}>
          <Text
            style={[
              styles.challengeScoreLabel,
              styles.challengeScoreLabelLeft,
              { color: tk.text.secondary },
            ]}
          >
            {t('create.myScore')}
          </Text>
          <View style={styles.challengeVsLabelSpacer} />
          <Text
            style={[
              styles.challengeScoreLabel,
              styles.challengeScoreLabelRight,
              { color: tk.text.secondary },
            ]}
          >
            {opponentName}
          </Text>
        </View>

        <View style={styles.challengeScoreRow}>
          {/* My score */}
          <View style={styles.challengeScoreField}>
            <View
              style={[
                styles.challengeScoreButton,
                {
                  backgroundColor: tk.surface.raised,
                  borderColor: tk.primary[700],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleDecrement('my')}
                activeOpacity={0.8}
                style={[
                  styles.challengeScoreAdjustButton,
                  {
                    borderColor: tk.border.default,
                    backgroundColor: tk.background.secondary,
                  },
                ]}
                accessibilityRole='button'
                accessibilityLabel={`${t('create.myScore')} minus`}
              >
                <Text
                  style={[
                    styles.challengeScoreAdjustButtonText,
                    { color: tk.text.secondary },
                  ]}
                >
                  -
                </Text>
              </TouchableOpacity>
              <Text
                style={[
                  styles.challengeScoreButtonValue,
                  { color: tk.primary[300] },
                ]}
              >
                {myScore}
              </Text>
              <TouchableOpacity
                onPress={() => handleIncrement('my')}
                activeOpacity={0.8}
                style={[
                  styles.challengeScoreAdjustButton,
                  {
                    borderColor: tk.border.default,
                    backgroundColor: tk.background.secondary,
                  },
                ]}
                accessibilityRole='button'
                accessibilityLabel={`${t('create.myScore')} plus`}
              >
                <Text
                  style={[
                    styles.challengeScoreAdjustButtonText,
                    { color: tk.text.secondary },
                  ]}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.challengeVsWrap}>
            <Text style={[styles.challengeVsText, { color: tk.text.muted }]}>
              {t('detail.vs')}
            </Text>
          </View>

          {/* Opponent score */}
          <View style={styles.challengeScoreField}>
            <View
              style={[
                styles.challengeScoreButton,
                {
                  backgroundColor: tk.surface.raised,
                  borderColor: tk.primary[700],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleDecrement('opponent')}
                activeOpacity={0.8}
                style={[
                  styles.challengeScoreAdjustButton,
                  {
                    borderColor: tk.border.default,
                    backgroundColor: tk.background.secondary,
                  },
                ]}
                accessibilityRole='button'
                accessibilityLabel={`${t('create.opponentScore')} minus`}
              >
                <Text
                  style={[
                    styles.challengeScoreAdjustButtonText,
                    { color: tk.text.secondary },
                  ]}
                >
                  -
                </Text>
              </TouchableOpacity>
              <Text
                style={[
                  styles.challengeScoreButtonValue,
                  { color: tk.primary[300] },
                ]}
              >
                {opponentScore}
              </Text>
              <TouchableOpacity
                onPress={() => handleIncrement('opponent')}
                activeOpacity={0.8}
                style={[
                  styles.challengeScoreAdjustButton,
                  {
                    borderColor: tk.border.default,
                    backgroundColor: tk.background.secondary,
                  },
                ]}
                accessibilityRole='button'
                accessibilityLabel={`${t('create.opponentScore')} plus`}
              >
                <Text
                  style={[
                    styles.challengeScoreAdjustButtonText,
                    { color: tk.text.secondary },
                  ]}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Beer counters */}
      <View style={styles.challengeBeerSection}>
        {[
          {
            label: `🍺 ${t('beers.myBeers')}`,
            value: myBeers,
            onDec: () => setMyBeers(prev => Math.max(0, prev - 1)),
            onInc: () => setMyBeers(prev => prev + 1),
          },
          {
            label: `🍺 ${opponentName}`,
            value: opponentBeers,
            onDec: () => setOpponentBeers(prev => Math.max(0, prev - 1)),
            onInc: () => setOpponentBeers(prev => prev + 1),
          },
        ].map(item => (
          <View key={item.label} style={styles.challengeBeerRow}>
            <View
              style={[
                styles.challengeBeerField,
                {
                  borderColor: tk.border.subtle,
                  backgroundColor: tk.surface.default,
                },
              ]}
            >
              <Text
                style={[
                  styles.challengeBeerLabel,
                  { color: tk.text.secondary },
                ]}
              >
                {item.label}
              </Text>
              <View style={styles.challengeBeerControls}>
                <TouchableOpacity
                  onPress={item.onDec}
                  activeOpacity={0.8}
                  style={[
                    styles.challengeBeerAdjustButton,
                    {
                      borderColor: tk.border.default,
                      backgroundColor: tk.background.secondary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.challengeBeerAdjustButtonText,
                      { color: tk.text.secondary },
                    ]}
                  >
                    -
                  </Text>
                </TouchableOpacity>
                <Text
                  style={[
                    styles.challengeBeerValue,
                    { color: tk.text.primary },
                  ]}
                >
                  {item.value}
                </Text>
                <TouchableOpacity
                  onPress={item.onInc}
                  activeOpacity={0.8}
                  style={[
                    styles.challengeBeerAdjustButton,
                    {
                      borderColor: tk.border.default,
                      backgroundColor: tk.background.secondary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.challengeBeerAdjustButtonText,
                      { color: tk.text.secondary },
                    ]}
                  >
                    +
                  </Text>
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
        disabled={myScore === opponentScore}
        isDark={isDark}
      />
    </View>
  );
};
