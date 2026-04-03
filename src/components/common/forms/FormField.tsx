import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type TextInputProps,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, typography, spacing } from '@/constants/theme';
import { useState } from 'react';
import { Input } from './Input';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  isDark?: boolean;
}

export const FormField = ({
  label,
  error,
  helperText,
  required,
  isDark = false,
  style,
  secureTextEntry,
  ...inputProps
}: FormFieldProps) => {
  const t = isDark ? theme.dark : theme.light;
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isPasswordField = secureTextEntry === true;

  return (
    <View style={styles.container}>
      <Text
        style={[styles.label, { color: t.text.primary }]}
        accessibilityRole='text'
      >
        {label}
        {required && <Text style={{ color: t.error.default }}> *</Text>}
      </Text>
      <View style={isPasswordField ? styles.inputWrapper : undefined}>
        <Input
          accessibilityLabel={label}
          accessibilityHint={helperText}
          secureTextEntry={isPasswordField && !passwordVisible}
          style={[
            error ? { borderColor: t.error.default } : undefined,
            isPasswordField ? { paddingRight: spacing[10] } : undefined,
            style,
          ]}
          {...inputProps}
        />
        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setPasswordVisible(v => !v)}
            style={styles.eyeButton}
            accessibilityRole='button'
            accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
          >
            <Feather
              name={passwordVisible ? 'eye-off' : 'eye'}
              size={18}
              color={t.text.muted}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text
          style={[styles.errorText, { color: t.error.default }]}
          accessibilityRole='alert'
          accessibilityLiveRegion='assertive'
        >
          {error}
        </Text>
      ) : helperText ? (
        <Text style={[styles.helperText, { color: t.text.muted }]}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing[1] + 2,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    fontFamily: typography.family.bodySemibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: typography.size.sm * 1.5,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  eyeButton: {
    position: 'absolute',
    right: spacing[3],
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bodyMedium,
    marginTop: 2,
  },
  helperText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    marginTop: 2,
  },
});
