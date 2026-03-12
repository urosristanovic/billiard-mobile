import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenLayout } from '@/components/common/layout';
import { useTheme } from '@/hooks/useTheme';
import { styles } from '../styles';

interface ConfirmViewProps {
  email: string;
  isDark: boolean;
  onBackToLogin: () => void;
}

export const ConfirmView = ({
  email,
  isDark,
  onBackToLogin,
}: ConfirmViewProps) => {
  const { t: tAuth } = useTranslation('auth');
  const { tk } = useTheme();

  return (
    <ScreenLayout isDark={isDark}>
      <View style={styles.confirmContainer}>
        <Text style={[styles.title, { color: tk.text.primary }]}>
          {tAuth('confirmEmail.title')}
        </Text>
        <Text style={[styles.subtitle, { color: tk.text.muted }]}>
          {tAuth('confirmEmail.message', { email })}
        </Text>
        <Text
          style={[styles.footerLink, { color: tk.primary[600] }]}
          onPress={onBackToLogin}
          accessibilityRole='link'
        >
          {tAuth('confirmEmail.backToLogin')}
        </Text>
      </View>
    </ScreenLayout>
  );
};
