import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenLayout } from '@/components/common/layout';
import { FormField, FormButtons } from '@/components/common/forms';
import { useLoginForm } from '@/features/auth/useLoginForm';
import { useAuthMutations } from '@/features/auth/useAuthMutations';
import { useTheme } from '@/hooks/useTheme';
import { styles } from './styles';

interface LoginScreenProps {
  onNavigateSignup: () => void;
  onNavigateForgotPassword: () => void;
  isDark?: boolean;
}

const LoginScreen = ({
  onNavigateSignup,
  onNavigateForgotPassword,
  isDark: isDarkProp,
}: LoginScreenProps) => {
  const { t: tAuth } = useTranslation('auth');
  const { isDark: systemDark, tk } = useTheme();
  const isDark = isDarkProp ?? systemDark;
  const { form, errors, updateField, validate } = useLoginForm();
  const { login } = useAuthMutations();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () =>
      setIsKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener(hideEvent, () =>
      setIsKeyboardVisible(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleSubmit = () => {
    if (!validate()) return;
    login.mutate({ email: form.email, password: form.password });
  };

  return (
    <ScreenLayout isDark={isDark}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            isKeyboardVisible && { justifyContent: 'flex-start' },
          ]}
          keyboardShouldPersistTaps='handled'
          keyboardDismissMode={
            Platform.OS === 'ios' ? 'interactive' : 'on-drag'
          }
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: tk.text.primary }]}>
              {tAuth('login.title')}
            </Text>
            <Text style={[styles.subtitle, { color: tk.text.muted }]}>
              {tAuth('login.subtitle')}
            </Text>
            <View
              style={[styles.divider, { backgroundColor: tk.primary[500] }]}
            />
          </View>

          <View style={styles.form}>
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
            <Text
              style={[styles.forgotPasswordLink, { color: tk.primary[600] }]}
              onPress={onNavigateForgotPassword}
              accessibilityRole='link'
            >
              {tAuth('login.forgotPasswordLink')}
            </Text>
          </View>

          <FormButtons
            submitLabel={tAuth('login.submitButton')}
            onSubmit={handleSubmit}
            submitLoading={login.isPending}
            isDark={isDark}
          />

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: tk.text.muted }]}>
              {tAuth('login.noAccount')}{' '}
            </Text>
            <Text
              style={[styles.footerLink, { color: tk.primary[600] }]}
              onPress={onNavigateSignup}
              accessibilityRole='link'
            >
              {tAuth('login.signupLink')}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};

export default LoginScreen;
