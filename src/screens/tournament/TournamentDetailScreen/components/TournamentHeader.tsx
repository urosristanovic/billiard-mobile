import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { styles } from '../styles';

interface TournamentHeaderProps {
  name: string;
  onBack: () => void;
}

export const TournamentHeader = ({ name, onBack }: TournamentHeaderProps) => {
  const { isDark, tk } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: tk.border.subtle }]}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole='button'
      >
        <Text style={[styles.back, { color: tk.primary[400] }]}>←</Text>
      </TouchableOpacity>
      <Text
        style={[styles.headerTitle, { color: tk.text.primary }]}
        numberOfLines={1}
      >
        {name}
      </Text>
      <View style={styles.backPlaceholder} />
    </View>
  );
};
