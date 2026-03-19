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
import { useToast } from '@/components/common/toast';
import { useAuthMutations } from '@/features/auth/useAuthMutations';
import { useTheme } from '@/hooks/useTheme';
import { styles } from './styles';

interface ChangePasswordScreenProps {
  navigation: {
    goBack: () => void;
  };
  isDark?: boolean;
}

const ChangePasswordScreen = ({
  navigation,
  isDark: isDarkProp,
}: ChangePasswordScreenProps) => {
  const { t } = useTranslation('common');
  const { t: tAuth } = useTranslation('auth');
  const { isDark: systemDark, tk } = useTheme();
  const { showToast } = useToast();
  const { changePassword } = useAuthMutations();
  const isDark = isDarkProp ?? systemDark;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState<string>();
  const [newPasswordError, setNewPasswordError] = useState<string>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>();

  const validate = () => {
    let valid = true;

    if (!currentPassword) {
      setCurrentPasswordError(tAuth('changePassword.currentPasswordRequired'));
      valid = false;
    } else {
      setCurrentPasswordError(undefined);
    }

    if (!newPassword) {
      setNewPasswordError(tAuth('validation.passwordRequired'));
      valid = false;
    } else if (newPassword.length < 8) {
      setNewPasswordError(tAuth('validation.passwordTooShort'));
      valid = false;
    } else {
      setNewPasswordError(undefined);
    }

    if (!confirmPassword) {
      setConfirmPasswordError(tAuth('validation.confirmPasswordRequired'));
      valid = false;
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError(tAuth('validation.passwordsDoNotMatch'));
      valid = false;
    } else {
      setConfirmPasswordError(undefined);
    }

    return valid;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            title: t('successTitle'),
            message: tAuth('changePassword.successMessage'),
          });
          navigation.goBack();
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
              {tAuth('changePassword.title')}
            </Text>
            <Text style={[styles.subtitle, { color: tk.text.muted }]}>
              {tAuth('changePassword.subtitle')}
            </Text>
            <View
              style={[styles.divider, { backgroundColor: tk.primary[500] }]}
            />
          </View>

          <View style={styles.form}>
            <FormField
              label={tAuth('changePassword.currentPasswordLabel')}
              value={currentPassword}
              onChangeText={v => {
                setCurrentPassword(v);
                if (currentPasswordError) setCurrentPasswordError(undefined);
              }}
              error={currentPasswordError}
              secureTextEntry
              autoCapitalize='none'
              placeholder={tAuth('changePassword.currentPasswordPlaceholder')}
              isDark={isDark}
            />
            <FormField
              label={tAuth('changePassword.newPasswordLabel')}
              value={newPassword}
              onChangeText={v => {
                setNewPassword(v);
                if (newPasswordError) setNewPasswordError(undefined);
              }}
              error={newPasswordError}
              secureTextEntry
              autoCapitalize='none'
              placeholder={tAuth('fields.passwordPlaceholder')}
              isDark={isDark}
            />
            <FormField
              label={tAuth('changePassword.confirmPasswordLabel')}
              value={confirmPassword}
              onChangeText={v => {
                setConfirmPassword(v);
                if (confirmPasswordError) setConfirmPasswordError(undefined);
              }}
              error={confirmPasswordError}
              secureTextEntry
              autoCapitalize='none'
              placeholder={tAuth('fields.confirmPasswordPlaceholder')}
              isDark={isDark}
            />
          </View>

          <FormButtons
            submitLabel='UPDATE'
            cancelLabel={t('cancel')}
            onSubmit={handleSubmit}
            onCancel={() => navigation.goBack()}
            submitLoading={changePassword.isPending}
            isDark={isDark}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};

export default ChangePasswordScreen;
