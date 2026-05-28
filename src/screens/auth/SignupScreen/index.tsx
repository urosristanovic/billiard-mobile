import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
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

const TERMS_URL = 'https://billiard-tracker.com/terms';
const PRIVACY_URL = 'https://billiard-tracker.com/privacy';

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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);

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
    const formValid = validate();
    if (!termsAccepted) {
      setTermsError(tAuth('signup.termsRequired'));
    }
    if (!formValid || !termsAccepted) return;
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
    <ScreenLayout isDark={isDark} includeBottomInset>
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

          <View>
            <Pressable
              style={styles.termsRow}
              onPress={() => {
                setTermsAccepted(prev => !prev);
                setTermsError(null);
              }}
              accessibilityRole='checkbox'
              accessibilityState={{ checked: termsAccepted }}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: termsError
                      ? tk.error.default
                      : termsAccepted
                        ? tk.primary[500]
                        : tk.border.strong,
                    backgroundColor: termsAccepted
                      ? tk.primary[500]
                      : 'transparent',
                  },
                ]}
              >
                {termsAccepted && (
                  <Text
                    style={[styles.checkmark, { color: tk.text.onPrimary }]}
                  >
                    ✓
                  </Text>
                )}
              </View>
              <View style={styles.termsTextWrap}>
                <Text style={[styles.termsText, { color: tk.text.muted }]}>
                  {tAuth('signup.termsAccept')}{' '}
                </Text>
                <Text
                  style={[styles.termsLink, { color: tk.primary[500] }]}
                  onPress={() => Linking.openURL(TERMS_URL)}
                  accessibilityRole='link'
                >
                  {tAuth('signup.termsLink')}
                </Text>
                <Text style={[styles.termsText, { color: tk.text.muted }]}>
                  {' '}{tAuth('signup.termsAnd')}{' '}
                </Text>
                <Text
                  style={[styles.termsLink, { color: tk.primary[500] }]}
                  onPress={() => Linking.openURL(PRIVACY_URL)}
                  accessibilityRole='link'
                >
                  {tAuth('signup.privacyLink')}
                </Text>
              </View>
            </Pressable>
            {termsError && (
              <Text style={[styles.termsError, { color: tk.error.text }]}>
                {termsError}
              </Text>
            )}
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
