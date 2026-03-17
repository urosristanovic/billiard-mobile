import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormModal } from './forms/FormModal';
import { PrimaryButton } from './buttons';
import { useMatchMutations } from '@/features/matches/useMatchMutations';
import { useTheme } from '@/hooks/useTheme';
import { DISCIPLINE_LABELS, DISCIPLINES } from '@/types/match';
import { typography, spacing, radius } from '@/constants/theme';
import type { Discipline } from '@/types';

const BEST_OF_OPTIONS = [3, 5, 7, 9] as const;

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
        onError: (err) => {
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
    <FormModal
      visible={visible}
      onClose={handleClose}
      title={t('modalTitle')}
      isDark={isDark}
      footer={
        !sent ? (
          <PrimaryButton
            label={createChallenge.isPending ? t('sending') : t('sendButton')}
            onPress={handleSend}
            loading={createChallenge.isPending}
            isDark={isDark}
          />
        ) : undefined
      }
    >
      {sent ? (
        <View style={styles.successContainer}>
          <Text style={[styles.successTitle, { color: tk.primary[300] }]}>
            {t('successTitle')}
          </Text>
          <Text style={[styles.successDesc, { color: tk.text.secondary }]}>
            {t('successDesc', { name: opponentName })}
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Discipline */}
          <View>
            <Text style={[styles.sectionLabel, { color: tk.text.secondary }]}>
              {t('disciplineLabel')}
            </Text>
            <View style={styles.pillRow}>
              {DISCIPLINES.map(d => (
                <TouchableOpacity
                  key={d}
                  onPress={() => setDiscipline(d)}
                  style={[
                    styles.pill,
                    {
                      borderColor: discipline === d ? tk.primary[500] : tk.primary[800],
                      backgroundColor: discipline === d ? tk.primary[900] : tk.surface.raised,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      { color: discipline === d ? tk.primary[300] : tk.text.secondary },
                    ]}
                  >
                    {DISCIPLINE_LABELS[d]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Best Of */}
          <View>
            <Text style={[styles.sectionLabel, { color: tk.text.secondary }]}>
              {t('bestOfLabel')}
            </Text>
            <View style={styles.pillRow}>
              {BEST_OF_OPTIONS.map(n => (
                <TouchableOpacity
                  key={n}
                  onPress={() => {
                    setBestOf(n);
                    setIsOtherBestOf(false);
                  }}
                  style={[
                    styles.pill,
                    {
                      borderColor:
                        !isOtherBestOf && bestOf === n ? tk.primary[500] : tk.primary[800],
                      backgroundColor:
                        !isOtherBestOf && bestOf === n
                          ? tk.primary[900]
                          : tk.surface.raised,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      {
                        color:
                          !isOtherBestOf && bestOf === n
                            ? tk.primary[300]
                            : tk.text.secondary,
                      },
                    ]}
                  >
                    {t(`bestOfOptions.${n}`)}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => setIsOtherBestOf(true)}
                style={[
                  styles.pill,
                  {
                    borderColor: isOtherBestOf ? tk.primary[500] : tk.primary[800],
                    backgroundColor: isOtherBestOf ? tk.primary[900] : tk.surface.raised,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    { color: isOtherBestOf ? tk.primary[300] : tk.text.secondary },
                  ]}
                >
                  {t('bestOfOptions.other')}
                </Text>
              </TouchableOpacity>
            </View>
            {isOtherBestOf && (
              <View
                style={[
                  styles.otherRow,
                  { borderColor: tk.primary[800], backgroundColor: tk.surface.raised },
                ]}
              >
                <TouchableOpacity
                  onPress={() => setOtherBestOf(prev => Math.max(1, prev - 2))}
                  style={[styles.otherStepButton, { borderColor: tk.primary[700] }]}
                >
                  <Text style={[styles.otherStepText, { color: tk.text.secondary }]}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.otherValue, { color: tk.text.primary }]}>
                  {t('bestOfOptions.otherValue', { value: otherBestOf })}
                </Text>
                <TouchableOpacity
                  onPress={() => setOtherBestOf(prev => prev + 2)}
                  style={[styles.otherStepButton, { borderColor: tk.primary[700] }]}
                >
                  <Text style={[styles.otherStepText, { color: tk.text.secondary }]}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Message */}
          <View>
            <Text style={[styles.sectionLabel, { color: tk.text.secondary }]}>
              {t('messageLabel')}
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder={t('messagePlaceholder')}
              placeholderTextColor={tk.text.muted}
              multiline
              numberOfLines={3}
              style={[
                styles.messageInput,
                {
                  color: tk.text.primary,
                  backgroundColor: tk.surface.raised,
                  borderColor: tk.primary[800],
                },
              ]}
            />
          </View>

          {apiError ? (
            <Text style={[styles.errorText, { color: tk.error.text }]}>
              {apiError}
            </Text>
          ) : null}

        </View>
      )}
    </FormModal>
  );
};

const styles = StyleSheet.create({
  content: {
    minHeight: 460,
    gap: spacing[4],
  },
  sectionLabel: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing[2],
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  pill: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    borderWidth: 1,
  },
  pillText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  otherRow: {
    marginTop: spacing[2],
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  otherStepButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherStepText: {
    fontSize: typography.size.lg,
    fontFamily: typography.family.display,
  },
  otherValue: {
    fontSize: typography.size.base,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: spacing[4],
    gap: spacing[2],
  },
  successTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    textAlign: 'center',
  },
});
