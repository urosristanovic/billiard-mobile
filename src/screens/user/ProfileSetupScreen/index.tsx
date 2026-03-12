import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenLayout } from '@/components/common/layout';
import { FormField, FormButtons } from '@/components/common/forms';
import { useProfileForm } from '@/features/auth/useProfileForm';
import { useAuthMutations } from '@/features/auth/useAuthMutations';
import { useTheme } from '@/hooks/useTheme';
import { styles } from './styles';

interface ProfileSetupScreenProps {
  isDark?: boolean;
}

const ProfileSetupScreen = ({
  isDark: isDarkProp,
}: ProfileSetupScreenProps) => {
  const { t } = useTranslation('common');
  const { t: tAuth } = useTranslation('auth');
  const { isDark: systemDark, tk } = useTheme();
  const isDark = isDarkProp ?? systemDark;
  const { form, errors, updateField, validate } = useProfileForm();
  const { updateProfile } = useAuthMutations();

  const handleSubmit = () => {
    if (!validate()) return;
    updateProfile.mutate({
      displayName: form.displayName,
      location: form.location || null,
      bio: form.bio || null,
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
