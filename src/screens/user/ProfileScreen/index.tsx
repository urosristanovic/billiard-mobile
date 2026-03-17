import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenLayout } from '@/components/common/layout';
import { LoadingState } from '@/components/common/states';
import { FormField, FormModal, FormButtons } from '@/components/common/forms';
import { DangerButton } from '@/components/common/buttons';
import { useConfirmDialog } from '@/components/common/dialog';
import { useAuth } from '@/features/auth/useAuth';
import { useAuthMutations } from '@/features/auth/useAuthMutations';
import { useProfileForm } from '@/features/auth/useProfileForm';
import { usePlayerRatings } from '@/features/ratings/useRatings';
import { useTheme } from '@/hooks/useTheme';
import { setStoredLanguage, type SupportedLanguage } from '@/i18n';
import { useState } from 'react';
import { ProfileHero, RatingsSection } from './components';
import { styles } from './styles';

interface ProfileScreenProps {
  isDark?: boolean;
}

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

const ProfileScreen = ({ isDark: isDarkProp }: ProfileScreenProps) => {
  const { t } = useTranslation('common');
  const { t: tAuth, i18n } = useTranslation('auth');
  const { isDark: systemDark, tk } = useTheme();
  const { confirm } = useConfirmDialog();
  const isDark = isDarkProp ?? systemDark;
  const { user } = useAuth();
  const { logout, updateProfile } = useAuthMutations();
  const { form, errors, updateField, loadForEdit, validate } = useProfileForm();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language).split(
    '-',
  )[0] as SupportedLanguage;
  const [pendingLanguage, setPendingLanguage] =
    useState<SupportedLanguage>(currentLanguage);

  const { data: ratings = [] } = usePlayerRatings(user?.id);

  if (!user) return <LoadingState isDark={isDark} />;

  const handleOpenEdit = () => {
    loadForEdit(user);
    setPendingLanguage(currentLanguage);
    setEditModalVisible(true);
  };
  const handleSaveProfile = () => {
    if (!validate()) return;
    const selectedLanguage = pendingLanguage;
    updateProfile.mutate(
      {
        displayName: form.displayName,
        location: form.location || null,
        bio: form.bio || null,
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
  const handleLogout = () => {
    confirm({
      title: tAuth('logout.title'),
      message: tAuth('logout.confirm'),
      cancelLabel: t('cancel'),
      confirmLabel: tAuth('logout.button'),
      variant: 'destructive',
      onConfirm: () => logout.mutate(),
    });
  };
  return (
    <ScreenLayout isDark={isDark}>
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileHero user={user} isDark={isDark} onEditPress={handleOpenEdit} />
        <RatingsSection ratings={ratings} isDark={isDark} />
        <DangerButton
          label={tAuth('logout.button')}
          onPress={handleLogout}
          loading={logout.isPending}
          isDark={isDark}
          style={styles.logoutSection}
        />
      </ScrollView>

      <FormModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setPendingLanguage(currentLanguage);
        }}
        title={tAuth('profile.editTitle')}
        isDark={isDark}
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
          label={tAuth('fields.location')}
          value={form.location}
          onChangeText={v => updateField('location', v)}
          placeholder={tAuth('fields.locationPlaceholder')}
          isDark={isDark}
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
      </FormModal>
    </ScreenLayout>
  );
};

export default ProfileScreen;
