import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, typography, radius, spacing, shadows } from '@/constants/theme';

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDark?: boolean;
}

export const FormModal = ({
  visible,
  onClose,
  title,
  children,
  isDark = false,
}: FormModalProps) => {
  const { t } = useTranslation('common');
  const insets = useSafeAreaInsets();
  const tk = isDark ? theme.dark : theme.light;

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        style={[styles.backdrop, { backgroundColor: tk.background.overlay }]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View
            style={[
              styles.panel,
              {
                backgroundColor: tk.surface.default,
                borderTopColor: tk.primary[700],
                paddingBottom: Math.max(insets.bottom, spacing[4]),
              },
              shadows.lg,
            ]}
          >
            <View
              style={[styles.header, { borderBottomColor: tk.border.default }]}
            >
              <Text style={[styles.title, { color: tk.text.primary }]}>
                {title}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                accessibilityRole='button'
                accessibilityLabel={t('closeA11y')}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <Text style={[styles.closeText, { color: tk.text.muted }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.body}
              contentContainerStyle={[
                styles.bodyContent,
                {
                  paddingBottom:
                    spacing[8] + Math.max(insets.bottom, spacing[3]),
                },
              ]}
              keyboardShouldPersistTaps='handled'
            >
              {children}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  panel: {
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    borderTopWidth: 2,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  closeText: {
    fontSize: typography.size.lg,
    fontFamily: typography.family.heading,
  },
  body: {
    flexShrink: 1,
  },
  bodyContent: {
    padding: spacing[6],
    gap: spacing[4],
  },
});
