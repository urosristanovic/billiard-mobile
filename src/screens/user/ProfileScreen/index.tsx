import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { LoadingState } from '@/components/common/states';
import { FormField, FormModal, FormButtons } from '@/components/common/forms';
import { useToast } from '@/components/common/toast';
import {
  DangerButton,
  GhostButton,
  PrimaryButton,
  SecondaryButton,
} from '@/components/common/buttons';
import { LocationPickerSheet } from '@/components/common/pickers';
import { useAuth } from '@/features/auth/useAuth';
import { useAuthMutations } from '@/features/auth/useAuthMutations';
import { useProfileForm } from '@/features/auth/useProfileForm';
import { useCountries, useCities } from '@/features/locations/useLocations';
import { useFeedbackMutation } from '@/features/feedback/useFeedbackMutation';
import { useTheme } from '@/hooks/useTheme';
import { setStoredLanguage, type SupportedLanguage } from '@/i18n';
import { typography, spacing } from '@/constants/theme';
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
  const { showToast } = useToast();
  const { user } = useAuth();
  const { updateProfile, deleteAccount } = useAuthMutations();
  const { submitFeedback } = useFeedbackMutation();
  const { form, errors, updateField, loadForEdit, validate } = useProfileForm();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language).split(
    '-',
  )[0] as SupportedLanguage;
  const [pendingLanguage, setPendingLanguage] =
    useState<SupportedLanguage>(currentLanguage);

  const { data: countries = [], isLoading: countriesLoading } =
    useCountries(editModalVisible);
  const { data: cities = [], isLoading: citiesLoading } = useCities(
    editModalVisible ? selectedCountryId || undefined : undefined,
  );

  const selectedCountryName =
    countries.find(c => c.id === selectedCountryId)?.name ?? '';

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
      tGroups('location.requestCityPrefix', { country: selectedCountryName }),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('submit'),
          onPress: (text: string | undefined) => {
            if (!text?.trim()) return;
            submitFeedback.mutate(
              {
                type: 'suggestion',
                message: `${tGroups('location.requestCityPrefix', { country: selectedCountryName })}${text.trim()}`,
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
          showToast({
            type: 'success',
            title: t('successTitle'),
            message: tAuth('profile.successMessage'),
          });
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
      <ScreenHeader
        onBack={() => navigation.goBack()}
        title={tAuth('settings.accountSettings')}
      />
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
        <GhostButton
          label={tAuth('changePassword.openButton')}
          onPress={() => navigation.navigate('ChangePassword')}
          isDark={isDark}
          style={styles.bottomBarButton}
        />
        <SecondaryButton
          label={tAuth('profile.editButton')}
          onPress={handleOpenEdit}
          isDark={isDark}
          labelStyle={{ fontSize: typography.size.sm }}
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
            cancelFirst
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

        <LocationPickerSheet
          label={tGroups('location.countryLabel')}
          placeholder={tGroups('location.countryPlaceholder')}
          items={countries}
          selectedId={selectedCountryId || null}
          onSelect={id => {
            setSelectedCountryId(id);
            setSelectedCityId('');
          }}
          onSelectOther={handleCountryOther}
          loading={countriesLoading}
          isDark={isDark}
        />

        {selectedCountryId ? (
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
        ) : null}

        <View style={styles.languageSection}>
          <Text style={[styles.languageLabel, { color: tk.text.primary }]}>
            {tAuth('profile.language')}
          </Text>
          <View style={styles.languageOptions}>
            {LANGUAGE_OPTIONS.map(option => {
              const isSelected = pendingLanguage === option.code;
              return isSelected ? (
                <PrimaryButton
                  key={option.code}
                  label={tAuth(option.labelKey)}
                  size='xs'
                  isDark={isDark}
                  onPress={() => setPendingLanguage(option.code)}
                />
              ) : (
                <SecondaryButton
                  key={option.code}
                  label={tAuth(option.labelKey)}
                  size='xs'
                  isDark={isDark}
                  onPress={() => setPendingLanguage(option.code)}
                />
              );
            })}
          </View>
        </View>

        <View style={deleteAccountStyles.container}>
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
