import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { GhostButton } from '@/components/common/buttons';
import { styles } from '../styles';

interface Props {
  name: string;
  onManage: () => void;
}

export const ScopeManageRow = ({ name, onManage }: Props) => {
  const { isDark, tk } = useTheme();
  const { t } = useTranslation('leaderboard');

  return (
    <View style={[styles.manageRow, { borderBottomColor: tk.primary[900] }]}>
      <Text style={[styles.manageGroupName, { color: tk.text.secondary }]}>
        {name}
      </Text>
      <GhostButton
        label={t('manage')}
        isDark={isDark}
        onPress={onManage}
      />
    </View>
  );
};
