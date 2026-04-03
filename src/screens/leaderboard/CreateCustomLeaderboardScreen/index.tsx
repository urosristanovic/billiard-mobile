import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { FormField, FormButtons, ToggleSwitch } from '@/components/common/forms';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import { useCustomLeaderboardMutations } from '@/features/leaderboard/useCustomLeaderboards';
import { useMyGroups } from '@/features/groups/useGroups';
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
  const { data: myGroups = [] } = useMyGroups();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>();
  const [threshold, setThreshold] = useState('10');
  const [isPublic, setIsPublic] = useState(false);
  const [nameError, setNameError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError(t('customLeaderboards.nameLabel') + ' is required');
      return;
    }
    const parsedThreshold = parseInt(threshold, 10);
    if (isNaN(parsedThreshold) || parsedThreshold < 1) {
      return;
    }
    setNameError('');
    createLeaderboard.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        groupId: selectedGroupId,
        provisionalThreshold: parsedThreshold,
        isPublic,
      },
      {
        onSuccess: lb => {
          navigation.replace('CustomLeaderboardDetail', {
            leaderboardId: lb.id,
          });
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

          {/* Group attachment */}
          {myGroups.length > 0 && (
            <View>
              <Text style={[styles.fieldLabel, { color: tk.text.secondary }]}>
                {t('customLeaderboards.groupLabel')}
              </Text>
              <View style={styles.groupOptions}>
                <GroupOption
                  label={t('customLeaderboards.groupPlaceholder')}
                  selected={!selectedGroupId}
                  isDark={isDark}
                  onPress={() => setSelectedGroupId(undefined)}
                />
                {myGroups.map(g => (
                  <GroupOption
                    key={g.id}
                    label={g.name}
                    selected={selectedGroupId === g.id}
                    isDark={isDark}
                    onPress={() => setSelectedGroupId(g.id)}
                  />
                ))}
              </View>
            </View>
          )}

          <FormField
            label={t('customLeaderboards.thresholdLabel')}
            value={threshold}
            onChangeText={setThreshold}
            placeholder='10'
            keyboardType='numeric'
            isDark={isDark}
          />
          <Text style={[styles.thresholdDesc, { color: tk.text.muted }]}>
            {t('customLeaderboards.thresholdDesc')}
          </Text>

          <View style={styles.switchRow}>
            <View style={styles.switchLabels}>
              <Text style={[styles.switchLabel, { color: tk.text.primary }]}>
                {t('customLeaderboards.publicLabel')}
              </Text>
            </View>
            <ToggleSwitch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: tk.border.default, true: tk.primary[600] }}
              thumbColor={tk.text.onPrimary}
            />
          </View>
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

interface GroupOptionProps {
  label: string;
  selected: boolean;
  isDark: boolean;
  onPress: () => void;
}

const GroupOption = ({ label, selected, isDark, onPress }: GroupOptionProps) =>
  selected ? (
    <PrimaryButton
      label={label}
      size='xs'
      isDark={isDark}
      onPress={onPress}
      style={optionStyles.pill}
    />
  ) : (
    <SecondaryButton
      label={label}
      size='xs'
      isDark={isDark}
      onPress={onPress}
      style={optionStyles.pill}
    />
  );

const optionStyles = StyleSheet.create({
  pill: {
    marginRight: spacing[2],
    marginBottom: spacing[2],
  },
});

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    paddingBottom: spacing[4],
    paddingTop: spacing[4],
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[4],
    gap: spacing[3],
  },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  form: {
    paddingHorizontal: spacing[4],
    gap: spacing[4],
  },
  fieldLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing[2],
  },
  groupOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  thresholdDesc: {
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
  switchLabels: { flex: 1 },
  switchLabel: {
    fontSize: typography.size.base,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.semibold,
  },
});

export default CreateCustomLeaderboardScreen;
