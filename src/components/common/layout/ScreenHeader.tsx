import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { typography, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface ScreenHeaderProps {
  title?: string;
  onBack: () => void;
  /** Optional element rendered on the right side (e.g. action button). */
  right?: React.ReactNode;
}

export const ScreenHeader = ({ title, onBack, right }: ScreenHeaderProps) => {
  const { t } = useTranslation('common');
  const { tk } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: tk.border.default }]}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.back}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole='button'
      >
        <Feather name='chevron-left' size={18} color={tk.primary[500]} />
        <Text style={[styles.backText, { color: tk.primary[500] }]}>
          {t('back')}
        </Text>
      </TouchableOpacity>

      {title ? (
        <Text
          style={[styles.title, { color: tk.text.primary }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      ) : (
        <View style={styles.titlePlaceholder} />
      )}

      <View style={styles.rightSlot}>{right ?? null}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingTop: spacing[10],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    gap: spacing[4],
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flexShrink: 0,
  },
  backText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    flex: 1,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  titlePlaceholder: { flex: 1 },
  rightSlot: { flexShrink: 0 },
});
