import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { styles } from '../styles';

interface Props {
  name: string;
  onManage: () => void;
}

export const ScopeManageRow = ({ name, onManage }: Props) => {
  const { tk } = useTheme();

  return (
    <View style={[styles.manageRow, { borderBottomColor: tk.primary[900] }]}>
      <Text style={[styles.manageGroupName, { color: tk.text.secondary }]}>
        {name}
      </Text>
      <TouchableOpacity
        onPress={onManage}
        style={[styles.manageButton, { borderColor: tk.primary[700] }]}
      >
        <Text style={[styles.manageButtonText, { color: tk.text.muted }]}>
          Manage
        </Text>
      </TouchableOpacity>
    </View>
  );
};
