import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, radius, minTouchTarget } from '@/constants/theme';

interface InputProps extends TextInputProps {
  variant?: 'default' | 'search';
}

export const Input = ({ variant = 'default', style, ...props }: InputProps) => {
  const { tk } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const isSearch = variant === 'search';

  return (
    <View style={isSearch ? styles.searchWrap : undefined}>
      {isSearch && (
        <View style={styles.iconWrap} pointerEvents='none'>
          <Feather name='search' size={18} color={tk.text.muted} />
        </View>
      )}
      <TextInput
        autoCapitalize={isSearch ? 'none' : props.autoCapitalize}
        autoCorrect={isSearch ? false : props.autoCorrect}
        placeholderTextColor={tk.text.muted}
        onFocus={e => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={e => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        style={[
          styles.base,
          isSearch ? styles.searchInput : styles.defaultInput,
          {
            backgroundColor: tk.surface.default,
            borderColor: isFocused ? tk.primary[500] : tk.border.strong,
            color: tk.text.primary,
          },
          style,
        ]}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  iconWrap: {
    position: 'absolute',
    left: spacing[4],
    zIndex: 1,
  },
  base: {
    borderWidth: 1,
    minHeight: minTouchTarget,
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  defaultInput: {
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  searchInput: {
    borderRadius: radius['2xl'],
    paddingLeft: spacing[12],
    paddingRight: spacing[4],
    paddingVertical: spacing[4],
  },
});
