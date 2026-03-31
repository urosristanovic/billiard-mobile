import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, typography, radius, spacing } from '@/constants/theme';
import { useState } from 'react';

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
  const [isFocused, setIsFocused] = useState(false);
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
        <TextInput
          placeholderTextColor={t.text.muted}
          accessibilityLabel={label}
          accessibilityHint={helperText}
          secureTextEntry={isPasswordField && !passwordVisible}
          onFocus={e => {
            setIsFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            inputProps.onBlur?.(e);
          }}
          style={[
            styles.input,
            {
              backgroundColor: t.surface.raised,
              borderColor: error
                ? t.error.default
                : isFocused
                  ? t.primary[500]
                  : t.border.default,
              color: t.text.primary,
              paddingRight: isPasswordField ? spacing[10] : spacing[3],
            },
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
  input: {
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
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
