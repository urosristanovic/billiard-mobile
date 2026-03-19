import { useEffect } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCreateMatchForm } from '@/features/matches/useCreateMatchForm';
import { useMatchMutations } from '@/features/matches/useMatchMutations';
import { ScreenLayout } from '@/components/common/layout';
import { PrimaryButton } from '@/components/common/buttons';
import { typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { DisciplineSelector, OpponentField } from './components';
import { styles } from './styles';
import type { CreateMatchStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<CreateMatchStackParamList, 'CreateMatch'>;

const CreateMatchScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation('matches');
  const { isDark, tk } = useTheme();
  const { form, errors, updateField, validate, toInput, reset } =
    useCreateMatchForm();
  const { createMatch } = useMatchMutations();

  useEffect(() => {
    if (route.params?.selectedOpponent) {
      updateField('opponent', route.params.selectedOpponent);
    }
  }, [route.params?.selectedOpponent]);

  const getScoreValue = (value: string) => Number(value);
  const setScore = (field: 'myScore' | 'opponentScore', value: number) => {
    updateField(field, String(Math.max(0, value)));
  };
  const handleIncrement = (field: 'myScore' | 'opponentScore') => {
    const nextValue = getScoreValue(form[field]) + 1;
    setScore(field, nextValue);
  };
  const handleDecrement = (field: 'myScore' | 'opponentScore') => {
    const currentValue = getScoreValue(form[field]);
    setScore(field, currentValue - 1);
  };
  const isSubmitDisabled =
    (Number(form.myScore) === 0 && Number(form.opponentScore) === 0) ||
    Number(form.myScore) === Number(form.opponentScore);

  const handleSubmit = () => {
    if (!validate()) return;
    createMatch.mutate(toInput(), {
      onSuccess: () => {
        reset();
        navigation.getParent()?.navigate('Matches');
      },
    });
  };

  return (
    <ScreenLayout isDark={isDark}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: tk.text.primary }]}>
            {t('create.title')}
          </Text>

          <DisciplineSelector
            value={form.discipline}
            onChange={d => updateField('discipline', d)}
            isDark={isDark}
          />

          <OpponentField
            opponent={form.opponent}
            error={errors.opponent}
            onPress={() =>
              navigation.navigate('UserSearch', { excludeId: undefined })
            }
            isDark={isDark}
          />

          <View style={styles.scoreSection}>
            <View style={styles.scoreLabelsRow}>
              <Text
                style={[
                  styles.scoreLabel,
                  styles.scoreLabelLeft,
                  { color: tk.text.secondary },
                ]}
              >
                {t('create.myScore')}
              </Text>
              <View style={styles.vsLabelSpacer} />
              <Text
                style={[
                  styles.scoreLabel,
                  styles.scoreLabelRight,
                  { color: tk.text.secondary },
                ]}
              >
                {t('create.opponentScore')}
              </Text>
            </View>
            <View style={styles.scoreRow}>
              <View style={styles.scoreField}>
                <View
                  style={[
                    styles.scoreButton,
                    {
                      backgroundColor: tk.surface.raised,
                      borderColor: tk.primary[700],
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleDecrement('myScore')}
                    activeOpacity={0.8}
                    style={[
                      styles.scoreAdjustButton,
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
                        styles.scoreAdjustButtonText,
                        { color: tk.text.secondary },
                      ]}
                    >
                      -
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.scoreButtonValue,
                      { color: tk.primary[300] },
                    ]}
                  >
                    {form.myScore.trim() === '' ? '0' : form.myScore}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleIncrement('myScore')}
                    activeOpacity={0.8}
                    style={[
                      styles.scoreAdjustButton,
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
                        styles.scoreAdjustButtonText,
                        { color: tk.text.secondary },
                      ]}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.vsWrap}>
                <Text style={[styles.vsText, { color: tk.text.muted }]}>
                  {t('detail.vs')}
                </Text>
              </View>
              <View style={styles.scoreField}>
                <View
                  style={[
                    styles.scoreButton,
                    {
                      backgroundColor: tk.surface.raised,
                      borderColor: tk.primary[700],
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleDecrement('opponentScore')}
                    activeOpacity={0.8}
                    style={[
                      styles.scoreAdjustButton,
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
                        styles.scoreAdjustButtonText,
                        { color: tk.text.secondary },
                      ]}
                    >
                      -
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.scoreButtonValue,
                      { color: tk.primary[300] },
                    ]}
                  >
                    {form.opponentScore.trim() === ''
                      ? '0'
                      : form.opponentScore}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleIncrement('opponentScore')}
                    activeOpacity={0.8}
                    style={[
                      styles.scoreAdjustButton,
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
                        styles.scoreAdjustButtonText,
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
          <View style={styles.beerSection}>
            <View style={styles.beerRow}>
              <View
                style={[
                  styles.beerField,
                  { borderColor: tk.border.subtle, backgroundColor: tk.surface.default },
                ]}
              >
                <Text style={[styles.beerLabel, { color: tk.text.secondary }]}>
                  🍺 {t('beers.myBeers')}
                </Text>
                <View style={styles.beerControls}>
                  <TouchableOpacity
                    onPress={() => updateField('myBeers', Math.max(0, form.myBeers - 1))}
                    activeOpacity={0.8}
                    style={[
                      styles.beerAdjustButton,
                      { borderColor: tk.border.default, backgroundColor: tk.background.secondary },
                    ]}
                  >
                    <Text style={[styles.beerAdjustButtonText, { color: tk.text.secondary }]}>
                      -
                    </Text>
                  </TouchableOpacity>
                  <Text style={[styles.beerValue, { color: tk.text.primary }]}>
                    {form.myBeers}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateField('myBeers', form.myBeers + 1)}
                    activeOpacity={0.8}
                    style={[
                      styles.beerAdjustButton,
                      { borderColor: tk.border.default, backgroundColor: tk.background.secondary },
                    ]}
                  >
                    <Text style={[styles.beerAdjustButtonText, { color: tk.text.secondary }]}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.beerRow}>
              <View
                style={[
                  styles.beerField,
                  { borderColor: tk.border.subtle, backgroundColor: tk.surface.default },
                ]}
              >
                <Text style={[styles.beerLabel, { color: tk.text.secondary }]}>
                  🍺 {t('beers.opponentBeers')}
                </Text>
                <View style={styles.beerControls}>
                  <TouchableOpacity
                    onPress={() =>
                      updateField('opponentBeers', Math.max(0, form.opponentBeers - 1))
                    }
                    activeOpacity={0.8}
                    style={[
                      styles.beerAdjustButton,
                      { borderColor: tk.border.default, backgroundColor: tk.background.secondary },
                    ]}
                  >
                    <Text style={[styles.beerAdjustButtonText, { color: tk.text.secondary }]}>
                      -
                    </Text>
                  </TouchableOpacity>
                  <Text style={[styles.beerValue, { color: tk.text.primary }]}>
                    {form.opponentBeers}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateField('opponentBeers', form.opponentBeers + 1)}
                    activeOpacity={0.8}
                    style={[
                      styles.beerAdjustButton,
                      { borderColor: tk.border.default, backgroundColor: tk.background.secondary },
                    ]}
                  >
                    <Text style={[styles.beerAdjustButtonText, { color: tk.text.secondary }]}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {errors.myScore ? (
            <Text style={[styles.scoreError, { color: tk.error.default }]}>
              {errors.myScore}
            </Text>
          ) : null}
          {errors.opponentScore ? (
            <Text style={[styles.scoreError, { color: tk.error.default }]}>
              {errors.opponentScore}
            </Text>
          ) : null}
          <View
            style={[
              styles.ratedRow,
              {
                backgroundColor: tk.surface.default,
                borderColor: tk.border.subtle,
              },
            ]}
          >
            <View style={styles.ratedInfo}>
              <Text style={[styles.ratedLabel, { color: tk.text.primary }]}>
                {t('create.isRated')}
              </Text>
              <Text style={[styles.ratedDesc, { color: tk.text.muted }]}>
                {t('create.isRatedDesc')}
              </Text>
            </View>
            <Switch
              value={form.isRated}
              onValueChange={v => updateField('isRated', v)}
              trackColor={{ false: tk.border.default, true: tk.primary[400] }}
              thumbColor={form.isRated ? tk.primary[600] : tk.surface.default}
            />
          </View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            {
              backgroundColor: tk.background.primary,
              borderTopColor: tk.border.subtle,
            },
          ]}
        >
          <PrimaryButton
            label={t('create.submitButton')}
            onPress={handleSubmit}
            loading={createMatch.isPending}
            disabled={isSubmitDisabled}
            isDark={isDark}
            style={styles.submitButton}
          />
        </View>
      </View>
    </ScreenLayout>
  );
};

export default CreateMatchScreen;
