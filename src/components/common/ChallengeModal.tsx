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

const BEST_OF_OPTIONS = [3, 5, 9] as const;

interface ChallengeModalProps {
  visible: boolean;
  onClose: () => void;
  opponentId: string;
  opponentName: string;
}

export const ChallengeModal = ({
  visible,
  onClose,
  opponentId,
  opponentName,
}: ChallengeModalProps) => {
  const { t } = useTranslation('challenges');
  const { isDark, tk } = useTheme();

  const [discipline, setDiscipline] = useState<Discipline>('8ball');
  const [bestOf, setBestOf] = useState<number>(3);
  const [isOtherBestOf, setIsOtherBestOf] = useState(false);
  const [otherBestOf, setOtherBestOf] = useState(1);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { createChallenge } = useMatchMutations();

  const handleSend = () => {
    setApiError(null);
    const selectedBestOf = isOtherBestOf ? otherBestOf : bestOf;
    createChallenge.mutate(
      {
        opponentId,
        discipline,
        bestOf: selectedBestOf,
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
    setDiscipline('8ball');
    setBestOf(3);
    setIsOtherBestOf(false);
    setOtherBestOf(1);
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

          {/* Best Of */}
          <View>
            <Text style={[styles.sectionLabel, { color: tk.text.secondary }]}>
              {t('bestOfLabel')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillRow}
            >
              {BEST_OF_OPTIONS.map(n => (
                <SecondaryButton
                  key={n}
                  label={t(`bestOfOptions.${n}`)}
                  onPress={() => {
                    setBestOf(n);
                    setIsOtherBestOf(false);
                  }}
                  compact
                  size='xs'
                  isDark={isDark}
                  style={
                    !isOtherBestOf && bestOf === n
                      ? {
                          backgroundColor: tk.primary[900],
                          borderColor: tk.primary[600],
                        }
                      : undefined
                  }
                />
              ))}
              <SecondaryButton
                label={t('bestOfOptions.other')}
                onPress={() => setIsOtherBestOf(true)}
                compact
                size='xs'
                isDark={isDark}
                style={
                  isOtherBestOf
                    ? {
                        backgroundColor: tk.primary[900],
                        borderColor: tk.primary[600],
                      }
                    : undefined
                }
              />
            </ScrollView>
            {isOtherBestOf && (
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
                  onPress={() => setOtherBestOf(prev => Math.max(1, prev - 2))}
                  style={[
                    styles.otherStepButton,
                    { borderColor: tk.primary[600] },
                  ]}
                >
                  <MinusIcon size={18} color={tk.text.secondary} />
                </TouchableOpacity>
                <Text style={[styles.otherValue, { color: tk.text.primary }]}>
                  {t('bestOfOptions.otherValue', { value: otherBestOf })}
                </Text>
                <TouchableOpacity
                  onPress={() => setOtherBestOf(prev => prev + 2)}
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
