import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout } from '@/components/common/layout';
import { FormField, FormButtons } from '@/components/common/forms';
import { useCustomLeaderboardMutations } from '@/features/leaderboard/useCustomLeaderboards';
import { useMyGroups } from '@/features/groups/useGroups';
import { typography, spacing, radius } from '@/constants/theme';
import type { LeaderboardStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<LeaderboardStackParamList, 'CreateCustomLeaderboard'>;

const CreateCustomLeaderboardScreen = ({ navigation }: Props) => {
  const { t } = useTranslation('groups');
  const { t: tCommon } = useTranslation('common');
  const { isDark, tk } = useTheme();
  const { createLeaderboard } = useCustomLeaderboardMutations();
  const { data: myGroups = [] } = useMyGroups();

  const [name, setName] = useState('');
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
        groupId: selectedGroupId,
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
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.header}>
          <Text
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { color: tk.primary[400] }]}
          >
            ← {tCommon('cancel')}
          </Text>
          <Text style={[styles.title, { color: tk.text.primary }]}>
            {t('customLeaderboards.createTitle')}
          </Text>
        </View>

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
                  onPress={() => setSelectedGroupId(undefined)}
                  selectedColor={tk.primary[300]}
                  selectedBg={tk.primary[900]}
                  defaultColor={tk.text.muted}
                  borderColor={tk.primary[800]}
                  selectedBorderColor={tk.primary[500]}
                />
                {myGroups.map(g => (
                  <GroupOption
                    key={g.id}
                    label={g.name}
                    selected={selectedGroupId === g.id}
                    onPress={() => setSelectedGroupId(g.id)}
                    selectedColor={tk.primary[300]}
                    selectedBg={tk.primary[900]}
                    defaultColor={tk.text.muted}
                    borderColor={tk.primary[800]}
                    selectedBorderColor={tk.primary[500]}
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
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: tk.primary[800], true: tk.primary[500] }}
              thumbColor={tk.text.onPrimary}
            />
          </View>
        </View>

        <FormButtons
          submitLabel={t('customLeaderboards.submit')}
          cancelLabel={tCommon('cancel')}
          onSubmit={handleSubmit}
          onCancel={() => navigation.goBack()}
          submitLoading={createLeaderboard.isPending}
          isDark={isDark}
        />
      </ScrollView>
    </ScreenLayout>
  );
};

interface GroupOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  selectedColor: string;
  selectedBg: string;
  defaultColor: string;
  borderColor: string;
  selectedBorderColor: string;
}

const GroupOption = ({
  label,
  selected,
  onPress,
  selectedColor,
  selectedBg,
  defaultColor,
  borderColor,
  selectedBorderColor,
}: GroupOptionProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      optionStyles.pill,
      {
        borderColor: selected ? selectedBorderColor : borderColor,
        backgroundColor: selected ? selectedBg : 'transparent',
      },
    ]}
  >
    <Text style={[optionStyles.pillText, { color: selected ? selectedColor : defaultColor }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const optionStyles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.sm,
    borderWidth: 1,
    marginRight: spacing[2],
    marginBottom: spacing[2],
  },
  pillText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing[8],
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[4],
    gap: spacing[3],
  },
  backButton: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing[2],
  },
  groupOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  thresholdDesc: {
    fontSize: typography.size.xs,
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
