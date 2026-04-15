import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { FormField, FormButtons, ToggleSwitch } from '@/components/common/forms';
import { useCustomLeaderboardMutations } from '@/features/leaderboard/useCustomLeaderboards';
import { typography, spacing } from '@/constants/theme';
import type { LeaderboardStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<
  LeaderboardStackParamList,
  'CreateCustomLeaderboard'
>;

const CreateCustomLeaderboardScreen = ({ navigation }: Props) => {
  const { t } = useTranslation('groups');
  const { t: tCommon } = useTranslation('common');
  const { isDark, tk } = useTheme();
  const { createLeaderboard } = useCustomLeaderboardMutations();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [threshold, setThreshold] = useState('10');
  const [isPublic, setIsPublic] = useState(false);
  const [nameError, setNameError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError(t('customLeaderboards.nameLabel') + ' is required');
      return;
    }
    const parsedThreshold = parseInt(threshold, 10);
    if (isNaN(parsedThreshold) || parsedThreshold < 1) return;

    setNameError('');
    createLeaderboard.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        provisionalThreshold: parsedThreshold,
        isPublic,
      },
      {
        onSuccess: lb => {
          navigation.replace('CustomLeaderboardDetail', { leaderboardId: lb.id });
        },
      },
    );
  };

  return (
    <ScreenLayout isDark={isDark}>
      <ScreenHeader
        onBack={() => navigation.goBack()}
        title={t('customLeaderboards.createTitle')}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.form}>
          <FormField
            label={t('customLeaderboards.nameLabel')}
            value={name}
            onChangeText={setName}
            error={nameError}
            placeholder={t('customLeaderboards.namePlaceholder')}
            isDark={isDark}
            required
          />

          <FormField
            label={t('customLeaderboards.descriptionLabel')}
            value={description}
            onChangeText={setDescription}
            placeholder={t('customLeaderboards.descriptionPlaceholder')}
            isDark={isDark}
          />

          <FormField
            label={t('customLeaderboards.thresholdLabel')}
            value={threshold}
            onChangeText={setThreshold}
            placeholder='10'
            keyboardType='numeric'
            isDark={isDark}
          />
          <Text style={[styles.fieldHint, { color: tk.text.muted }]}>
            {t('customLeaderboards.thresholdDesc')}
          </Text>

          {/* Public toggle */}
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: tk.text.primary }]}>
              {t('customLeaderboards.publicLabel')}
            </Text>
            <ToggleSwitch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: tk.border.default, true: tk.primary[600] }}
              thumbColor={tk.text.onPrimary}
            />
          </View>
          <Text style={[styles.fieldHint, { color: tk.text.muted }]}>
            {t('customLeaderboards.publicDesc')}
          </Text>

        </View>
      </ScrollView>
      <FormButtons
        submitLabel={t('customLeaderboards.submit')}
        cancelLabel={tCommon('cancel')}
        onSubmit={handleSubmit}
        onCancel={() => navigation.goBack()}
        submitLoading={createLeaderboard.isPending}
        isDark={isDark}
        cancelFirst
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    paddingBottom: spacing[4],
    paddingTop: spacing[4],
  },
  form: {
    paddingHorizontal: spacing[4],
    gap: spacing[4],
  },
  fieldHint: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    marginTop: -spacing[2],
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  switchLabel: {
    flex: 1,
    fontSize: typography.size.base,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.semibold,
  },
});

export default CreateCustomLeaderboardScreen;
