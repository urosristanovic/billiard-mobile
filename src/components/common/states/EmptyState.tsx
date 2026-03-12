import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing } from '@/constants/theme';
import { PrimaryButton } from '../buttons/PrimaryButton';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  icon?: React.ReactNode;
  isDark?: boolean;
}

export const EmptyState = ({
  title,
  description,
  action,
  icon,
  isDark = false,
}: EmptyStateProps) => {
  const { t } = useTranslation('common');
  const tk = isDark ? theme.dark : theme.light;

  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.title, { color: tk.text.primary }]}>
        {title ?? t('emptyState')}
      </Text>
      {description && (
        <Text style={[styles.description, { color: tk.text.muted }]}>
          {description}
        </Text>
      )}
      {action && (
        <PrimaryButton
          label={action.label}
          onPress={action.onPress}
          isDark={isDark}
          compact
          style={styles.actionButton}
        />
      )}
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
    paddingHorizontal: spacing[6],
  },
  icon: {
    marginBottom: spacing[2],
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    textAlign: 'center',
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
  },
  actionButton: {
    marginTop: spacing[2],
    alignSelf: 'center',
  },
});
