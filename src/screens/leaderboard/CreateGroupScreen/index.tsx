import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { FormField, FormButtons, ToggleSwitch } from '@/components/common/forms';
import { useGroupMutations } from '@/features/groups/useGroups';
import { typography, spacing } from '@/constants/theme';
import type { LeaderboardStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<LeaderboardStackParamList, 'CreateGroup'>;

const CreateGroupScreen = ({ navigation }: Props) => {
  const { t } = useTranslation('groups');
  const { t: tCommon } = useTranslation('common');
  const { isDark, tk } = useTheme();
  const { createGroup } = useGroupMutations();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [nameError, setNameError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError(t('groups.nameLabel') + ' is required');
      return;
    }
    setNameError('');
    createGroup.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        isPublic,
      },
      {
        onSuccess: group => {
          navigation.replace('GroupDetail', { groupId: group.id });
        },
      },
    );
  };

  return (
    <ScreenLayout isDark={isDark}>
      <ScreenHeader
        onBack={() => navigation.goBack()}
        title={t('groups.createTitle')}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.form}>
          <FormField
            label={t('groups.nameLabel')}
            value={name}
            onChangeText={setName}
            error={nameError}
            placeholder={t('groups.namePlaceholder')}
            isDark={isDark}
            required
          />
          <FormField
            label={t('groups.descriptionLabel')}
            value={description}
            onChangeText={setDescription}
            placeholder={t('groups.descriptionPlaceholder')}
            multiline
            numberOfLines={3}
            isDark={isDark}
          />
          <View style={styles.switchRow}>
            <View style={styles.switchLabels}>
              <Text style={[styles.switchLabel, { color: tk.text.primary }]}>
                {t('groups.publicLabel')}
              </Text>
              <Text style={[styles.switchDesc, { color: tk.text.muted }]}>
                {t('groups.publicDesc')}
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
        submitLabel={t('groups.submit')}
        cancelLabel={tCommon('cancel')}
        onSubmit={handleSubmit}
        onCancel={() => navigation.goBack()}
        submitLoading={createGroup.isPending}
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
  switchDesc: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    marginTop: 2,
  },
});

export default CreateGroupScreen;
