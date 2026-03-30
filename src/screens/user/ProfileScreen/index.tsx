import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenLayout } from '@/components/common/layout';
import { LoadingState } from '@/components/common/states';
import { FormField, FormModal, FormButtons } from '@/components/common/forms';
import { DangerButton, SecondaryButton } from '@/components/common/buttons';
import { useAuth } from '@/features/auth/useAuth';
import { useAuthMutations } from '@/features/auth/useAuthMutations';
import { useProfileForm } from '@/features/auth/useProfileForm';
import { useCountries, useCities } from '@/features/locations/useLocations';
import { useTheme } from '@/hooks/useTheme';
import { setStoredLanguage, type SupportedLanguage } from '@/i18n';
import { typography, spacing, radius } from '@/constants/theme';
import type { HomeStackParamList } from '@/navigation/AppNavigator';
import { ProfileHero } from './components';
import { styles } from './styles';

type Props = NativeStackScreenProps<HomeStackParamList, 'Profile'>;

const LANGUAGE_OPTIONS: Array<{
  code: SupportedLanguage;
  labelKey:
    | 'profile.languageEnglish'
    | 'profile.languageSerbian'
    | 'profile.languageSpanish';
}> = [
  { code: 'en', labelKey: 'profile.languageEnglish' },
  { code: 'sr', labelKey: 'profile.languageSerbian' },
  { code: 'es', labelKey: 'profile.languageSpanish' },
];

const ProfileScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation('common');
  const { t: tAuth, i18n } = useTranslation('auth');
  const { t: tGroups } = useTranslation('groups');
  const { isDark, tk } = useTheme();
  const { user } = useAuth();
  const { updateProfile, deleteAccount } = useAuthMutations();
  const { form, errors, updateField, loadForEdit, validate } = useProfileForm();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [countryListOpen, setCountryListOpen] = useState(false);
  const [cityListOpen, setCityListOpen] = useState(false);
  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language).split(
    '-',
  )[0] as SupportedLanguage;
  const [pendingLanguage, setPendingLanguage] =
    useState<SupportedLanguage>(currentLanguage);

  const { data: countries = [], isLoading: countriesLoading } = useCountries(editModalVisible);
  const { data: cities = [], isLoading: citiesLoading } = useCities(
    editModalVisible ? selectedCountryId || undefined : undefined,
  );

  if (!user) return <LoadingState isDark={isDark} />;

  const handleOpenEdit = () => {
    loadForEdit(user);
    setPendingLanguage(currentLanguage);
    setSelectedCountryId(user.countryId ?? '');
    setSelectedCityId(user.cityId ?? '');
    setEditModalVisible(true);
  };
  const handleSaveProfile = () => {
    if (!validate()) return;
    const selectedLanguage = pendingLanguage;
    updateProfile.mutate(
      {
        displayName: form.displayName,
        bio: form.bio || null,
        countryId: selectedCountryId || null,
        cityId: selectedCityId || null,
      },
      {
        onSuccess: () => {
          setEditModalVisible(false);
          if (selectedLanguage !== currentLanguage) {
            void i18n.changeLanguage(selectedLanguage);
            void setStoredLanguage(selectedLanguage);
          }
        },
      },
    );
  };

  useEffect(() => {
    if (!route.params?.edit || !user) return;
    handleOpenEdit();
    navigation.setParams({ edit: undefined });
  }, [navigation, route.params?.edit, user]);

  return (
    <ScreenLayout isDark={isDark}>
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileHero user={user} isDark={isDark} />
      </ScrollView>
      <View
        style={[
          styles.bottomBar,
          {
            borderTopColor: tk.border.default,
            backgroundColor: tk.surface.default,
          },
        ]}
      >
        <SecondaryButton
          label={tAuth('profile.editButton')}
          onPress={handleOpenEdit}
          isDark={isDark}
          style={styles.bottomBarButton}
        />
      </View>

      <FormModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setPendingLanguage(currentLanguage);
        }}
        title={tAuth('profile.editTitle')}
        isDark={isDark}
        footer={
          <FormButtons
            submitLabel={t('save')}
            cancelLabel={t('cancel')}
            onSubmit={handleSaveProfile}
            onCancel={() => {
              setEditModalVisible(false);
              setPendingLanguage(currentLanguage);
            }}
            submitLoading={updateProfile.isPending}
            isDark={isDark}
          />
        }
      >
        <FormField
          label={tAuth('fields.displayName')}
          value={form.displayName}
          onChangeText={v => updateField('displayName', v)}
          error={errors.displayName}
          isDark={isDark}
          required
        />
        <FormField
          label={tAuth('fields.bio')}
          value={form.bio}
          onChangeText={v => updateField('bio', v)}
          placeholder={tAuth('fields.bioPlaceholder')}
          multiline
          numberOfLines={3}
          isDark={isDark}
        />

        {/* Country picker */}
        <View>
          <Text style={[pickerStyles.label, { color: tk.text.secondary }]}>
            {tGroups('location.countryLabel')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setCountryListOpen(v => !v);
              setCityListOpen(false);
            }}
            style={[pickerStyles.selectButton, { backgroundColor: tk.surface.raised, borderColor: countryListOpen ? tk.primary[500] : tk.primary[700] }]}
          >
            <Text style={[pickerStyles.selectButtonText, { color: selectedCountryId ? tk.text.primary : tk.text.muted }]}>
              {selectedCountryId ? (countries.find(c => c.id === selectedCountryId)?.name ?? tGroups('location.countryPlaceholder')) : tGroups('location.countryPlaceholder')}
            </Text>
            {countriesLoading
              ? <ActivityIndicator size='small' color={tk.primary[400]} />
              : <Text style={{ color: tk.text.muted }}>{countryListOpen ? '▴' : '▾'}</Text>
            }
          </TouchableOpacity>
          {countryListOpen && !countriesLoading && (
            <ScrollView
              style={[pickerStyles.inlineList, { borderColor: tk.primary[700], backgroundColor: tk.surface.raised }]}
              nestedScrollEnabled
            >
              {countries.map(c => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => {
                    setSelectedCountryId(c.id);
                    setSelectedCityId('');
                    setCountryListOpen(false);
                  }}
                  style={[pickerStyles.inlineOption, { borderBottomColor: tk.primary[900] }, selectedCountryId === c.id && { backgroundColor: tk.primary[900] }]}
                >
                  <Text style={[pickerStyles.inlineOptionText, { color: tk.text.primary }]}>{c.name}</Text>
                  <Text style={[pickerStyles.inlineOptionCode, { color: tk.text.muted }]}>{c.code}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* City picker */}
        {selectedCountryId ? (
          <View>
            <Text style={[pickerStyles.label, { color: tk.text.secondary }]}>
              {tGroups('location.cityLabel')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (!citiesLoading) {
                  setCityListOpen(v => !v);
                  setCountryListOpen(false);
                }
              }}
              style={[pickerStyles.selectButton, { backgroundColor: tk.surface.raised, borderColor: cityListOpen ? tk.primary[500] : tk.primary[700] }]}
            >
              <Text style={[pickerStyles.selectButtonText, { color: selectedCityId ? tk.text.primary : tk.text.muted }]}>
                {selectedCityId ? (cities.find(c => c.id === selectedCityId)?.name ?? tGroups('location.cityPlaceholder')) : tGroups('location.cityPlaceholder')}
              </Text>
              {citiesLoading
                ? <ActivityIndicator size='small' color={tk.primary[400]} />
                : <Text style={{ color: tk.text.muted }}>{cityListOpen ? '▴' : '▾'}</Text>
              }
            </TouchableOpacity>
            {cityListOpen && !citiesLoading && (
              <ScrollView
                style={[pickerStyles.inlineList, { borderColor: tk.primary[700], backgroundColor: tk.surface.raised }]}
                nestedScrollEnabled
              >
                <TouchableOpacity
                  onPress={() => { setSelectedCityId(''); setCityListOpen(false); }}
                  style={[pickerStyles.inlineOption, { borderBottomColor: tk.primary[900] }]}
                >
                  <Text style={[pickerStyles.inlineOptionText, { color: tk.text.muted }]}>{tGroups('location.cityPlaceholder')}</Text>
                </TouchableOpacity>
                {cities.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => { setSelectedCityId(c.id); setCityListOpen(false); }}
                    style={[pickerStyles.inlineOption, { borderBottomColor: tk.primary[900] }, selectedCityId === c.id && { backgroundColor: tk.primary[900] }]}
                  >
                    <Text style={[pickerStyles.inlineOptionText, { color: tk.text.primary }]}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        ) : null}

        <View style={styles.languageSection}>
          <Text style={[styles.languageLabel, { color: tk.text.primary }]}>
            {tAuth('profile.language')}
          </Text>
          <View style={styles.languageOptions}>
            {LANGUAGE_OPTIONS.map(option => {
              const isSelected = pendingLanguage === option.code;
              return (
                <TouchableOpacity
                  key={option.code}
                  onPress={() => setPendingLanguage(option.code)}
                  style={[
                    styles.languageButton,
                    {
                      borderColor: isSelected
                        ? tk.primary[500]
                        : tk.border.default,
                      backgroundColor: isSelected
                        ? tk.primary[900]
                        : tk.background.secondary,
                    },
                  ]}
                  accessibilityRole='button'
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    style={[
                      styles.languageButtonText,
                      {
                        color: isSelected ? tk.primary[300] : tk.text.secondary,
                      },
                    ]}
                  >
                    {tAuth(option.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={deleteAccountStyles.container}>
          <SecondaryButton
            label={tAuth('changePassword.openButton')}
            onPress={() => {
              setEditModalVisible(false);
              setPendingLanguage(currentLanguage);
              navigation.navigate('ChangePassword');
            }}
            isDark={isDark}
          />
          <DangerButton
            label={tAuth('profile.deleteAccount')}
            onPress={() => {
              Alert.alert(
                tAuth('deleteAccount.title'),
                tAuth('deleteAccount.message'),
                [
                  {
                    text: tAuth('deleteAccount.cancel'),
                    style: 'cancel',
                  },
                  {
                    text: tAuth('deleteAccount.confirm'),
                    style: 'destructive',
                    onPress: () => deleteAccount.mutate(),
                  },
                ],
              );
            }}
            disabled={deleteAccount.isPending}
            isDark={isDark}
          />
        </View>
      </FormModal>

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
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    minHeight: 48,
  },
  selectButtonText: {
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
    flex: 1,
  },
  inlineList: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
    maxHeight: 200,
  },
  inlineOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    minHeight: 44,
  },
  inlineOptionText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    flex: 1,
  },
  inlineOptionCode: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
  },
});

const deleteAccountStyles = StyleSheet.create({
  container: {
    marginTop: spacing[6],
    paddingTop: spacing[4],
    gap: spacing[3],
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
});

export default ProfileScreen;
