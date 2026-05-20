import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenLayout } from '@/components/common/layout';
import { FormField, FormButtons } from '@/components/common/forms';
import { useToast } from '@/components/common/toast';
import { LocationPickerSheet } from '@/components/common/pickers';
import { useProfileForm } from '@/features/auth/useProfileForm';
import { useAuthMutations } from '@/features/auth/useAuthMutations';
import { useCountries, useCities } from '@/features/locations/useLocations';
import { useFeedbackMutation } from '@/features/feedback/useFeedbackMutation';
import { useTheme } from '@/hooks/useTheme';
import { styles } from './styles';
import type { Country } from '@/types/location';

interface ProfileSetupScreenProps {
  isDark?: boolean;
}

const ProfileSetupScreen = ({
  isDark: isDarkProp,
}: ProfileSetupScreenProps) => {
  const { t } = useTranslation('common');
  const { t: tAuth } = useTranslation('auth');
  const { t: tGroups } = useTranslation('groups');
  const { isDark: systemDark, tk } = useTheme();
  const isDark = isDarkProp ?? systemDark;
  const { showToast } = useToast();
  const { form, errors, updateField, validate } = useProfileForm();
  const { updateProfile } = useAuthMutations();
  const { submitFeedback } = useFeedbackMutation();

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [countryError, setCountryError] = useState('');

  const { data: countries = [], isLoading: countriesLoading } = useCountries();
  const { data: cities = [], isLoading: citiesLoading } = useCities(
    selectedCountry?.id,
  );

  const handleCountryOther = () => {
    Alert.prompt(
      tGroups('location.countryLabel'),
      tGroups('location.requestCountryPrefix'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('submit'),
          onPress: (text: string | undefined) => {
            if (!text?.trim()) return;
            submitFeedback.mutate(
              {
                type: 'suggestion',
                message: `${tGroups('location.requestCountryPrefix')}${text.trim()}`,
              },
              {
                onSuccess: () =>
                  showToast({
                    type: 'success',
                    title: t('successTitle'),
                    message: tGroups('location.requestSent'),
                  }),
              },
            );
          },
        },
      ],
      'plain-text',
    );
  };

  const handleCityOther = () => {
    Alert.prompt(
      tGroups('location.cityLabel'),
      tGroups('location.requestCityPrefix', {
        country: selectedCountry?.name ?? '',
      }),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('submit'),
          onPress: (text: string | undefined) => {
            if (!text?.trim()) return;
            submitFeedback.mutate(
              {
                type: 'suggestion',
                message: `${tGroups('location.requestCityPrefix', { country: selectedCountry?.name ?? '' })}${text.trim()}`,
              },
              {
                onSuccess: () =>
                  showToast({
                    type: 'success',
                    title: t('successTitle'),
                    message: tGroups('location.requestSent'),
                  }),
              },
            );
          },
        },
      ],
      'plain-text',
    );
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (!selectedCountry) {
      setCountryError(tGroups('location.countryRequired'));
      return;
    }
    setCountryError('');
    updateProfile.mutate({
      displayName: form.displayName,
      bio: form.bio || null,
      countryId: selectedCountry.id,
      cityId: selectedCityId || null,
    });
  };

  return (
    <ScreenLayout isDark={isDark}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: tk.text.primary }]}>
            {tAuth('profileSetup.title')}
          </Text>
          <Text style={[styles.subtitle, { color: tk.text.muted }]}>
            {tAuth('profileSetup.subtitle')}
          </Text>
          <View
            style={[styles.divider, { backgroundColor: tk.primary[500] }]}
          />
        </View>

        <View style={styles.form}>
          <FormField
            label={tAuth('fields.displayName')}
            value={form.displayName}
            onChangeText={v => updateField('displayName', v)}
            error={errors.displayName}
            placeholder={tAuth('fields.displayNamePlaceholder')}
            isDark={isDark}
            required
          />

          <LocationPickerSheet
            label={tGroups('location.countryLabel')}
            placeholder={tGroups('location.countryPlaceholder')}
            items={countries}
            selectedId={selectedCountry?.id ?? null}
            onSelect={id => {
              const found = countries.find(c => c.id === id) ?? null;
              setSelectedCountry(found);
              setSelectedCityId('');
              setCountryError('');
            }}
            onSelectOther={handleCountryOther}
            loading={countriesLoading}
            error={countryError}
            required
            isDark={isDark}
          />

          {selectedCountry && (
            <LocationPickerSheet
              label={tGroups('location.cityLabel')}
              placeholder={tGroups('location.cityPlaceholder')}
              items={cities}
              selectedId={selectedCityId || null}
              onSelect={setSelectedCityId}
              onSelectOther={handleCityOther}
              loading={citiesLoading}
              isDark={isDark}
            />
          )}

          <FormField
            label={tAuth('fields.bio')}
            value={form.bio}
            onChangeText={v => updateField('bio', v)}
            placeholder={tAuth('fields.bioPlaceholder')}
            multiline
            numberOfLines={3}
            isDark={isDark}
          />
        </View>

        <FormButtons
          submitLabel={tAuth('profileSetup.submitButton')}
          cancelLabel={t('cancel')}
          onSubmit={handleSubmit}
          submitLoading={updateProfile.isPending}
          isDark={isDark}
        />
      </ScrollView>
    </ScreenLayout>
  );
};

export default ProfileSetupScreen;
