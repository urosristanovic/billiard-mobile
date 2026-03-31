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
import { useAuthMutations } from '@/features/auth/useAuthMutations';
import { useTheme } from '@/hooks/useTheme';
import { styles } from './styles';

interface ForgotPasswordScreenProps {
  onNavigateLogin: () => void;
  isDark?: boolean;
}

const ForgotPasswordScreen = ({
  onNavigateLogin,
  isDark: isDarkProp,
}: ForgotPasswordScreenProps) => {
  const { t: tAuth } = useTranslation('auth');
  const { isDark: systemDark, tk } = useTheme();
  const isDark = isDarkProp ?? systemDark;
  const { forgotPassword } = useAuthMutations();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const validate = () => {
    const normalized = email.trim();
    if (!normalized) {
      setError(tAuth('validation.emailRequired'));
      return false;
    }

    const isValid = /\S+@\S+\.\S+/.test(normalized);
    if (!isValid) {
      setError(tAuth('validation.emailInvalid'));
      return false;
    }

    setError(undefined);
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const normalized = email.trim().toLowerCase();
    forgotPassword.mutate(
      { email: normalized },
      {
        onSuccess: () => {
          setSentTo(normalized);
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
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: tk.text.primary }]}>
              {tAuth('forgotPassword.title')}
            </Text>
            <Text style={[styles.subtitle, { color: tk.text.muted }]}>
              {tAuth('forgotPassword.subtitle')}
            </Text>
            <View
              style={[styles.divider, { backgroundColor: tk.primary[500] }]}
            />
          </View>

          <View style={styles.form}>
            <FormField
              label={tAuth('fields.email')}
              value={email}
              onChangeText={v => {
                setEmail(v);
                if (error) setError(undefined);
              }}
              error={error}
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
              placeholder={tAuth('fields.emailPlaceholder')}
              isDark={isDark}
            />

            {sentTo ? (
              <View
                style={[
                  styles.successBox,
                  {
                    borderColor: tk.success.border,
                    backgroundColor: isDark
                      ? tk.success.dark
                      : tk.success.light,
                  },
                ]}
              >
                <Text style={[styles.successTitle, { color: tk.success.default }]}>
                  {tAuth('forgotPassword.successTitle')}
                </Text>
                <Text style={[styles.successText, { color: tk.text.primary }]}>
                  {tAuth('forgotPassword.successMessage', { email: sentTo })}
                </Text>
              </View>
            ) : null}
          </View>

          <FormButtons
            submitLabel={tAuth('forgotPassword.submitButton')}
            cancelLabel={tAuth('forgotPassword.backToLogin')}
            onSubmit={handleSubmit}
            onCancel={onNavigateLogin}
            submitLoading={forgotPassword.isPending}
            isDark={isDark}
            cancelFirst
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};

export default ForgotPasswordScreen;
