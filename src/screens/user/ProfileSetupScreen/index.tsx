import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenLayout } from '@/components/common/layout';
import { FormField, FormButtons } from '@/components/common/forms';
import { useProfileForm } from '@/features/auth/useProfileForm';
import { useAuthMutations } from '@/features/auth/useAuthMutations';
import { useCountries, useCities } from '@/features/locations/useLocations';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, radius } from '@/constants/theme';
import { scale } from '@/utils/scale';
import { styles } from './styles';
import type { Country, City } from '@/types/location';

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
  const { form, errors, updateField, validate } = useProfileForm();
  const { updateProfile } = useAuthMutations();

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [countryError, setCountryError] = useState('');

  const { data: countries = [] } = useCountries();
  const { data: cities = [] } = useCities(selectedCountry?.id);

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
      cityId: selectedCity?.id ?? null,
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

          {/* Country picker */}
          <View>
            <Text style={[pickerStyles.label, { color: tk.text.secondary }]}>
              {tGroups('location.countryLabel')} *
            </Text>
            <TouchableOpacity
              onPress={() => setCountryModalVisible(true)}
              style={[
                pickerStyles.pickerButton,
                {
                  backgroundColor: tk.surface.raised,
                  borderColor: countryError ? '#ef4444' : tk.primary[700],
                },
              ]}
            >
              <Text
                style={[
                  pickerStyles.pickerButtonText,
                  { color: selectedCountry ? tk.text.primary : tk.text.muted },
                ]}
              >
                {selectedCountry?.name ?? tGroups('location.countryPlaceholder')}
              </Text>
              <Text style={{ color: tk.text.muted }}>▾</Text>
            </TouchableOpacity>
            {countryError ? (
              <Text style={[pickerStyles.errorText, { color: '#ef4444' }]}>
                {countryError}
              </Text>
            ) : null}
          </View>

          {/* City picker */}
          {selectedCountry && (
            <View>
              <Text style={[pickerStyles.label, { color: tk.text.secondary }]}>
                {tGroups('location.cityLabel')}
              </Text>
              <TouchableOpacity
                onPress={() => setCityModalVisible(true)}
                style={[
                  pickerStyles.pickerButton,
                  { backgroundColor: tk.surface.raised, borderColor: tk.primary[700] },
                ]}
              >
                <Text
                  style={[
                    pickerStyles.pickerButtonText,
                    { color: selectedCity ? tk.text.primary : tk.text.muted },
                  ]}
                >
                  {selectedCity?.name ?? tGroups('location.cityPlaceholder')}
                </Text>
                <Text style={{ color: tk.text.muted }}>▾</Text>
              </TouchableOpacity>
            </View>
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

      {/* Country picker modal */}
      <Modal
        visible={countryModalVisible}
        animationType='slide'
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <View style={[pickerStyles.modal, { backgroundColor: tk.background.primary }]}>
          <View style={[pickerStyles.modalHeader, { borderBottomColor: tk.primary[800] }]}>
            <Text style={[pickerStyles.modalTitle, { color: tk.text.primary }]}>
              {tGroups('location.countryLabel')}
            </Text>
            <TouchableOpacity onPress={() => setCountryModalVisible(false)}>
              <Text style={[pickerStyles.modalClose, { color: tk.primary[400] }]}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {countries.map(country => (
              <TouchableOpacity
                key={country.id}
                onPress={() => {
                  setSelectedCountry(country);
                  setSelectedCity(null);
                  setCountryModalVisible(false);
                }}
                style={[
                  pickerStyles.modalOption,
                  { borderBottomColor: tk.primary[900] },
                  selectedCountry?.id === country.id && { backgroundColor: tk.primary[900] },
                ]}
              >
                <Text style={[pickerStyles.modalOptionText, { color: tk.text.primary }]}>
                  {country.name}
                </Text>
                <Text style={[pickerStyles.modalOptionCode, { color: tk.text.muted }]}>
                  {country.code}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* City picker modal */}
      <Modal
        visible={cityModalVisible}
        animationType='slide'
        onRequestClose={() => setCityModalVisible(false)}
      >
        <View style={[pickerStyles.modal, { backgroundColor: tk.background.primary }]}>
          <View style={[pickerStyles.modalHeader, { borderBottomColor: tk.primary[800] }]}>
            <Text style={[pickerStyles.modalTitle, { color: tk.text.primary }]}>
              {tGroups('location.cityLabel')}
            </Text>
            <TouchableOpacity onPress={() => setCityModalVisible(false)}>
              <Text style={[pickerStyles.modalClose, { color: tk.primary[400] }]}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {/* Clear city option */}
            <TouchableOpacity
              onPress={() => {
                setSelectedCity(null);
                setCityModalVisible(false);
              }}
              style={[pickerStyles.modalOption, { borderBottomColor: tk.primary[900] }]}
            >
              <Text style={[pickerStyles.modalOptionText, { color: tk.text.muted }]}>
                {tGroups('location.cityPlaceholder')}
              </Text>
            </TouchableOpacity>
            {cities.map(city => (
              <TouchableOpacity
                key={city.id}
                onPress={() => {
                  setSelectedCity(city);
                  setCityModalVisible(false);
                }}
                style={[
                  pickerStyles.modalOption,
                  { borderBottomColor: tk.primary[900] },
                  selectedCity?.id === city.id && { backgroundColor: tk.primary[900] },
                ]}
              >
                <Text style={[pickerStyles.modalOptionText, { color: tk.text.primary }]}>
                  {city.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </ScreenLayout>
  );
};

const pickerStyles = StyleSheet.create({
  label: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing[2],
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    minHeight: scale(48),
  },
  pickerButtonText: {
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
    flex: 1,
  },
  errorText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    marginTop: spacing[1],
  },
  modal: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[12],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalClose: {
    fontSize: typography.size.xl,
    fontFamily: typography.family.display,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    minHeight: scale(56),
  },
  modalOptionText: {
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
  },
  modalOptionCode: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
});

export default ProfileSetupScreen;
