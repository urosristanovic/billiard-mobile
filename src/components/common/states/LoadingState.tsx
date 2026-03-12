import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing } from '@/constants/theme';

interface LoadingStateProps {
  message?: string;
  isDark?: boolean;
}

export const LoadingState = ({
  message,
  isDark = false,
}: LoadingStateProps) => {
  const { t } = useTranslation('common');
  const tk = isDark ? theme.dark : theme.light;

  return (
    <View
      style={styles.container}
      accessibilityRole='progressbar'
      accessibilityLiveRegion='polite'
    >
      <ActivityIndicator size='large' color={tk.primary[400]} />
      <Text style={[styles.message, { color: tk.text.muted }]}>
        {message ?? t('loading')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    paddingVertical: spacing[16],
  },
  message: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodyMedium,
    textAlign: 'center',
  },
});
