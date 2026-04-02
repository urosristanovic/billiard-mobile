import {
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useState } from 'react';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { PrimaryButton } from '@/components/common/buttons';
import { FormField } from '@/components/common/forms';
import { DropdownFilter } from '@/components/common/filters';
import { useCreateTournamentForm } from '@/features/tournaments/useCreateTournamentForm';
import { useTournamentMutations } from '@/features/tournaments/useTournamentMutations';
import type { UpdateTournamentInput } from '@/types/tournament';
import { FormatPicker, VisibilityPicker } from './components';
import { DISCIPLINES, DISCIPLINE_LABELS, type Discipline } from '@/types/match';
import { typography, spacing, radius } from '@/constants/theme';
import type { TournamentsStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<
  TournamentsStackParamList,
  'CreateTournament'
>;

const formatDateTime = (date: Date): string => {
  const dateStr = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${dateStr}  ${timeStr}`;
};

const CreateTournamentScreen = ({ navigation, route }: Props) => {
  const editTournament = route.params?.tournament;
  const isEditMode = Boolean(editTournament);

  const { t } = useTranslation('tournaments');
  const { isDark, tk } = useTheme();
  const { form, errors, setField, validate, buildInput, reset } =
    useCreateTournamentForm(
      editTournament
        ? {
            name: editTournament.name,
            description: editTournament.description ?? undefined,
            discipline: editTournament.discipline,
            format: editTournament.format,
            visibility: editTournament.visibility,
            maxParticipants: editTournament.maxParticipants,
            scheduledAt: editTournament.scheduledAt,
            location: editTournament.location ?? undefined,
            isRated: editTournament.isRated,
          }
        : undefined,
    );
  const { createTournament, updateTournament } = useTournamentMutations();

  const [pickerDate, setPickerDate] = useState<Date>(() => {
    if (editTournament?.scheduledAt) {
      return new Date(editTournament.scheduledAt);
    }
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setMinutes(0, 0, 0);
    return d;
  });
  const [showPicker, setShowPicker] = useState(false);
  const [androidStep, setAndroidStep] = useState<'date' | 'time'>('date');

  const openPicker = () => {
    if (showPicker && Platform.OS === 'ios') {
      setShowPicker(false);
      return;
    }
    if (Platform.OS === 'android') {
      setAndroidStep('date');
    }
    setShowPicker(true);
  };

  const handlePickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'dismissed') return;
      const date = selected ?? pickerDate;
      if (androidStep === 'date') {
        setPickerDate(date);
        setAndroidStep('time');
        setShowPicker(true);
      } else {
        const finalDate = new Date(pickerDate);
        finalDate.setHours(date.getHours(), date.getMinutes(), 0, 0);
        setPickerDate(finalDate);
        setField('scheduledAt', finalDate.toISOString());
      }
    } else {
      if (selected) {
        setPickerDate(selected);
        setField('scheduledAt', selected.toISOString());
      }
    }
  };

  const disciplineOptions = DISCIPLINES.map(d => ({
    value: d,
    label: DISCIPLINE_LABELS[d],
  }));

  const handleSubmit = () => {
    if (!validate()) return;
    const input = buildInput();

    if (isEditMode && editTournament) {
      const updateInput: UpdateTournamentInput = {
        name: input.name,
        description: input.description,
        discipline: input.discipline,
        format: input.format,
        visibility: input.visibility,
        maxParticipants: input.maxParticipants,
        scheduledAt: input.scheduledAt,
        location: input.location,
        isRated: input.isRated,
      };
      updateTournament.mutate(
        { id: editTournament.id, input: updateInput },
        { onSuccess: () => navigation.goBack() },
      );
    } else {
      createTournament.mutate(input, {
        onSuccess: () => {
          reset();
          navigation.goBack();
        },
      });
    }
  };

  return (
    <ScreenLayout isDark={isDark}>
      <ScreenHeader
        onBack={() => navigation.goBack()}
        title={isEditMode ? t('edit.title') : t('create.title')}
      />

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        <FormField
          label={t('create.name')}
          placeholder={t('create.namePlaceholder')}
          value={form.name}
          onChangeText={v => setField('name', v)}
          error={errors.name}
          required
          isDark={isDark}
          maxLength={100}
        />

        <FormField
          label={t('create.description')}
          placeholder={t('create.descriptionPlaceholder')}
          value={form.description}
          onChangeText={v => setField('description', v)}
          isDark={isDark}
          multiline
          numberOfLines={3}
          style={{ minHeight: 80, textAlignVertical: 'top' }}
        />

        {/* Discipline */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: tk.text.primary }]}>
            {t('create.discipline')}{' '}
            <Text style={{ color: tk.error.default }}>*</Text>
          </Text>
          <DropdownFilter
            options={disciplineOptions}
            value={form.discipline}
            onSelect={v => setField('discipline', v as Discipline)}
            isDark={isDark}
          />
          {errors.discipline && (
            <Text style={[styles.errorText, { color: tk.error.default }]}>
              {errors.discipline}
            </Text>
          )}
        </View>

        <FormatPicker
          value={form.format}
          onChange={v => setField('format', v)}
          isDark={isDark}
        />
        {errors.format && (
          <Text style={[styles.errorText, { color: tk.error.default }]}>
            {errors.format}
          </Text>
        )}

        <VisibilityPicker
          value={form.visibility}
          onChange={v => setField('visibility', v)}
          isDark={isDark}
        />

        <FormField
          label={t('create.maxParticipants')}
          placeholder={t('create.maxParticipantsPlaceholder')}
          value={form.maxParticipants}
          onChangeText={v => setField('maxParticipants', v)}
          error={errors.maxParticipants}
          required
          isDark={isDark}
          keyboardType='number-pad'
        />

        {/* Date & Time picker */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: tk.text.primary }]}>
            {t('create.scheduledAt')}{' '}
            <Text style={{ color: tk.error.default }}>*</Text>
          </Text>
          <TouchableOpacity
            onPress={openPicker}
            style={[
              styles.dateButton,
              {
                backgroundColor: tk.surface.raised,
                borderColor: errors.scheduledAt
                  ? tk.error.default
                  : tk.border.default,
              },
            ]}
            accessibilityRole='button'
          >
            <Text
              style={[
                styles.dateButtonText,
                {
                  color: form.scheduledAt ? tk.text.primary : tk.text.muted,
                },
              ]}
            >
              {form.scheduledAt
                ? formatDateTime(pickerDate)
                : t('create.scheduledAtPlaceholder')}
            </Text>
            <Text style={[styles.dateIcon, { color: tk.text.muted }]}>📅</Text>
          </TouchableOpacity>
          {errors.scheduledAt && (
            <Text style={[styles.errorText, { color: tk.error.default }]}>
              {errors.scheduledAt}
            </Text>
          )}
          {showPicker &&
            (Platform.OS === 'ios' ? (
              <View
                style={[
                  styles.pickerContainer,
                  { borderColor: tk.border.subtle },
                ]}
              >
                <DateTimePicker
                  value={pickerDate}
                  mode='datetime'
                  display='spinner'
                  minimumDate={new Date()}
                  onChange={handlePickerChange}
                  textColor={tk.primary[700]}
                  accentColor={tk.primary[400]}
                  style={styles.picker}
                />
              </View>
            ) : (
              <DateTimePicker
                value={pickerDate}
                mode={androidStep}
                display='default'
                minimumDate={new Date()}
                onChange={handlePickerChange}
              />
            ))}
        </View>

        <FormField
          label={t('create.location')}
          placeholder={t('create.locationPlaceholder')}
          value={form.location}
          onChangeText={v => setField('location', v)}
          isDark={isDark}
        />

        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={[styles.fieldLabel, { color: tk.text.primary }]}>
              {t('create.isRated')}
            </Text>
            <Text style={[styles.toggleHint, { color: tk.text.muted }]}>
              {t('create.isRatedHint')}
            </Text>
          </View>
          <Switch
            value={form.isRated}
            onValueChange={v => setField('isRated', v)}
            trackColor={{ false: tk.border.default, true: tk.primary[600] }}
            thumbColor={tk.surface.raised}
          />
        </View>

        <PrimaryButton
          label={isEditMode ? t('edit.submitButton') : t('create.submitButton')}
          onPress={handleSubmit}
          loading={
            isEditMode ? updateTournament.isPending : createTournament.isPending
          }
          isDark={isDark}
          style={styles.submitButton}
        />
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: spacing[4],
    gap: spacing[5],
    paddingBottom: spacing[12],
  },
  fieldGroup: {
    gap: spacing[1] + 2,
  },
  fieldLabel: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodySemibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bodyMedium,
    marginTop: 2,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  dateButtonText: {
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
    flex: 1,
  },
  dateIcon: {
    fontSize: 16,
    marginLeft: spacing[2],
  },
  pickerContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    overflow: 'hidden',
    marginTop: spacing[2],
  },
  picker: {
    width: '100%',
  },
  submitButton: {
    marginTop: spacing[2],
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleText: {
    flex: 1,
    marginRight: spacing[3],
    gap: spacing[1],
  },
  toggleHint: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
  },
});

export default CreateTournamentScreen;
