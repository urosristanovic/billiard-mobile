import { Modal, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { SecondaryButton } from './buttons';
import { CueIcon } from './icons';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, iconSize } from '@/constants/theme';
import { scale } from '@/utils/scale';
import type { AppTabParamList } from '@/navigation/AppNavigator';

interface ChallengeSentModalProps {
  visible: boolean;
  opponentName: string;
  onClose: () => void;
}

export const ChallengeSentModal = ({
  visible,
  opponentName,
  onClose,
}: ChallengeSentModalProps) => {
  const { t } = useTranslation('challenges');
  const { tk } = useTheme();
  const navigation = useNavigation<NavigationProp<AppTabParamList>>();

  const [descBefore, descAfter] = t('successDesc', { name: '\x00' }).split('\x00');

  const handleReturnHome = () => {
    onClose();
    navigation.navigate('Home', { screen: 'HomeFeed' });
  };

  return (
    <Modal
      visible={visible}
      animationType='fade'
      statusBarTranslucent
      transparent={false}
    >
      <View style={[styles.container, { backgroundColor: tk.background.primary }]}>
        <View style={styles.content}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: tk.success.dark,
                borderColor: tk.success.border,
                shadowColor: tk.success.default,
              },
            ]}
          >
            <CueIcon size={iconSize['2xl']} color={tk.success.default} />
          </View>

          <Text style={[styles.title, { color: tk.text.primary }]}>
            {t('successTitle')}
          </Text>

          <Text style={[styles.desc, { color: tk.text.secondary }]}>
            {descBefore}
            <Text style={{ color: tk.primary[400], fontFamily: typography.family.display }}>
              {opponentName}
            </Text>
            {descAfter}
          </Text>
        </View>

        <SecondaryButton
          label={t('successClose')}
          onPress={handleReturnHome}
          isDark
          style={styles.closeButton}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[10],
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
  },
  iconCircle: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  title: {
    fontSize: typography.size['3xl'],
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  desc: {
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
    textAlign: 'center',
    lineHeight: typography.size.base * 1.6,
    paddingHorizontal: spacing[4],
  },
  closeButton: {
    width: '100%',
  },
});
