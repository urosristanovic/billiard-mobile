import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface LoadingProps {
  size?: 'small' | 'large';
  style?: StyleProp<ViewStyle>;
}

export const Loading = ({ size = 'small', style }: LoadingProps) => {
  const { tk } = useTheme();

  return (
    <ActivityIndicator size={size} color={tk.primary[600]} style={style} />
  );
};
