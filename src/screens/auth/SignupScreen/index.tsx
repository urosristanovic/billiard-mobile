import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenLayout } from '@/components/common/layout';
import { FormField, FormButtons } from '@/components/common/forms';
import { useSignupForm } from '@/features/auth/useSignupForm';
import { useAuthMutations } from '@/features/auth/useAuthMutations';
import { useTheme } from '@/hooks/useTheme';
import { ConfirmView } from './components';
import { styles } from './styles';

interface SignupScreenProps {
  onNavigateLogin: () => void;
  isDark?: boolean;
}

const SignupScreen = ({
  onNavigateLogin,
  isDark: isDarkProp,
}: SignupScreenProps) => {
  const { t: tAuth } = useTranslation('auth');
  const { isDark: systemDark, tk } = useTheme();
  const isDark = isDarkProp ?? systemDark;
  const { form, errors, updateField, validate } = useSignupForm();
  const { signup } = useAuthMutations();
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  if (awaitingConfirmation) {
    return (
      <ConfirmView
        email={form.email}
        isDark={isDark}
        onBackToLogin={onNavigateLogin}
      />
    );
  }

  const handleSubmit = () => {
    if (!validate()) return;
    signup.mutate(
      {
        email: form.email,
        password: form.password,
        username: form.username,
        displayName: form.displayName,
      },
      {
        onError: err => {
          if (err.message === 'CONFIRM_EMAIL') setAwaitingConfirmation(true);
        },
      },
    );
  };

  return (
    <ScreenLayout isDark={isDark}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps='handled'
          keyboardDismissMode={
            Platform.OS === 'ios' ? 'interactive' : 'on-drag'
          }
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: tk.text.primary }]}>
              {tAuth('signup.title')}
            </Text>
            <Text style={[styles.subtitle, { color: tk.text.muted }]}>
              {tAuth('signup.subtitle')}
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
            />
            <FormField
              label={tAuth('fields.username')}
              value={form.username}
              onChangeText={v => updateField('username', v.toLowerCase())}
              error={errors.username}
              autoCapitalize='none'
              autoCorrect={false}
              placeholder={tAuth('fields.usernamePlaceholder')}
              isDark={isDark}
            />
            <FormField
              label={tAuth('fields.email')}
              value={form.email}
              onChangeText={v => updateField('email', v)}
              error={errors.email}
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
              placeholder={tAuth('fields.emailPlaceholder')}
              isDark={isDark}
            />
            <FormField
              label={tAuth('fields.password')}
              value={form.password}
              onChangeText={v => updateField('password', v)}
              error={errors.password}
              secureTextEntry
              placeholder={tAuth('fields.passwordPlaceholder')}
              isDark={isDark}
            />
            <FormField
              label={tAuth('fields.confirmPassword')}
              value={form.confirmPassword}
              onChangeText={v => updateField('confirmPassword', v)}
              error={errors.confirmPassword}
              secureTextEntry
              placeholder={tAuth('fields.confirmPasswordPlaceholder')}
              isDark={isDark}
            />
          </View>

          <FormButtons
            submitLabel={tAuth('signup.submitButton')}
            onSubmit={handleSubmit}
            submitLoading={signup.isPending}
            isDark={isDark}
          />

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: tk.text.muted }]}>
              {tAuth('signup.hasAccount')}{' '}
            </Text>
            <Text
              style={[styles.footerLink, { color: tk.primary[600] }]}
              onPress={onNavigateLogin}
              accessibilityRole='link'
            >
              {tAuth('signup.loginLink')}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};

export default SignupScreen;
