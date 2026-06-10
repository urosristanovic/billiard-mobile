import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormField, FormModal } from './forms';
import { PrimaryButton, SecondaryButton } from './buttons';
import { MinusIcon, PlusIcon } from './icons';
import { ChallengeSentModal } from './ChallengeSentModal';
import { useMatchMutations } from '@/features/matches/useMatchMutations';
import { useTheme } from '@/hooks/useTheme';
import { DISCIPLINE_LABELS, DISCIPLINES } from '@/types/match';
import type { Discipline } from '@/types';
import { styles } from './ChallengeModal.styles';

const RACE_TO_OPTIONS = [2, 3, 5, 7, 9] as const;
const RACE_TO_PRESET_SET = new Set<number>(RACE_TO_OPTIONS);

interface ChallengeModalProps {
  visible: boolean;
  onClose: () => void;
  opponentId: string;
  opponentName: string;
  initialDiscipline?: Discipline;
  initialRaceTo?: number;
}

export const ChallengeModal = ({
  visible,
  onClose,
  opponentId,
  opponentName,
  initialDiscipline,
  initialRaceTo,
}: ChallengeModalProps) => {
  const { t } = useTranslation('challenges');
  const { isDark, tk } = useTheme();

  const initIsOther = initialRaceTo != null && !RACE_TO_PRESET_SET.has(initialRaceTo);
  const [discipline, setDiscipline] = useState<Discipline>(initialDiscipline ?? '8ball');
  const [raceTo, setRaceTo] = useState<number>(
    initialRaceTo != null && RACE_TO_PRESET_SET.has(initialRaceTo) ? initialRaceTo : 2,
  );
  const [isOtherRaceTo, setIsOtherRaceTo] = useState(initIsOther);
  const [otherRaceTo, setOtherRaceTo] = useState(
    initialRaceTo != null && !RACE_TO_PRESET_SET.has(initialRaceTo) ? initialRaceTo : 1,
  );
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { createChallenge } = useMatchMutations();

  const handleSend = () => {
    setApiError(null);
    const selectedRaceTo = isOtherRaceTo ? otherRaceTo : raceTo;
    createChallenge.mutate(
      {
        opponentId,
        discipline,
        raceTo: selectedRaceTo,
        message: message.trim() || undefined,
      },
      {
        onSuccess: () => {
          setSent(true);
        },
        onError: err => {
          setApiError(err instanceof Error ? err.message : t('errorTitle'));
        },
      },
    );
  };

  const handleClose = () => {
    setSent(false);
    setApiError(null);
    setMessage('');
    setDiscipline(initialDiscipline ?? '8ball');
    setRaceTo(
      initialRaceTo != null && RACE_TO_PRESET_SET.has(initialRaceTo) ? initialRaceTo : 3,
    );
    setIsOtherRaceTo(initialRaceTo != null && !RACE_TO_PRESET_SET.has(initialRaceTo));
    setOtherRaceTo(
      initialRaceTo != null && !RACE_TO_PRESET_SET.has(initialRaceTo) ? initialRaceTo : 1,
    );
    onClose();
  };

  return (
    <>
      <FormModal
        visible={visible && !sent}
        onClose={handleClose}
        title={t('modalTitle', { name: opponentName })}
        isDark={isDark}
        footer={
          <PrimaryButton
            label={createChallenge.isPending ? t('sending') : t('sendButton')}
            onPress={handleSend}
            loading={createChallenge.isPending}
            isDark={isDark}
          />
        }
      >
        <View style={styles.content}>
          {/* Discipline */}
          <View>
            <Text style={[styles.sectionLabel, { color: tk.text.secondary }]}>
              {t('disciplineLabel')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillRow}
            >
              {DISCIPLINES.map(d => (
                <SecondaryButton
                  key={d}
                  label={DISCIPLINE_LABELS[d]}
                  onPress={() => setDiscipline(d)}
                  compact
                  size='xs'
                  isDark={isDark}
                  style={
                    discipline === d
                      ? {
                          backgroundColor: tk.primary[900],
                          borderColor: tk.primary[600],
                        }
                      : undefined
                  }
                />
              ))}
            </ScrollView>
          </View>

          {/* Race To */}
          <View>
            <Text style={[styles.sectionLabel, { color: tk.text.secondary }]}>
              {t('raceToLabel')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillRow}
            >
              {RACE_TO_OPTIONS.map(n => (
                <SecondaryButton
                  key={n}
                  label={t(`raceToOptions.${n}`)}
                  onPress={() => {
                    setRaceTo(n);
                    setIsOtherRaceTo(false);
                  }}
                  compact
                  size='xs'
                  isDark={isDark}
                  style={
                    !isOtherRaceTo && raceTo === n
                      ? {
                          backgroundColor: tk.primary[900],
                          borderColor: tk.primary[600],
                        }
                      : undefined
                  }
                />
              ))}
              <SecondaryButton
                label={t('raceToOptions.other')}
                onPress={() => setIsOtherRaceTo(true)}
                compact
                size='xs'
                isDark={isDark}
                style={
                  isOtherRaceTo
                    ? {
                        backgroundColor: tk.primary[900],
                        borderColor: tk.primary[600],
                      }
                    : undefined
                }
              />
            </ScrollView>
            {isOtherRaceTo && (
              <View
                style={[
                  styles.otherRow,
                  {
                    borderColor: tk.primary[600],
                    backgroundColor: tk.surface.raised,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => setOtherRaceTo(prev => Math.max(1, prev - 1))}
                  style={[
                    styles.otherStepButton,
                    { borderColor: tk.primary[600] },
                  ]}
                >
                  <MinusIcon size={18} color={tk.text.secondary} />
                </TouchableOpacity>
                <Text style={[styles.otherValue, { color: tk.text.primary }]}>
                  {t('raceToOptions.otherValue', { value: otherRaceTo })}
                </Text>
                <TouchableOpacity
                  onPress={() => setOtherRaceTo(prev => prev + 1)}
                  style={[
                    styles.otherStepButton,
                    { borderColor: tk.primary[700] },
                  ]}
                >
                  <PlusIcon size={18} color={tk.text.secondary} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {apiError ? (
            <Text style={[styles.errorText, { color: tk.error.text }]}>
              {apiError}
            </Text>
          ) : null}
        </View>
      </FormModal>
      <ChallengeSentModal
        visible={sent}
        opponentName={opponentName}
        onClose={handleClose}
      />
    </>
  );
};
