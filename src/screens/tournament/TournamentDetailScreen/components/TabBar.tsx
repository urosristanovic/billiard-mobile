import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { styles } from '../styles';

export interface Tab<T extends string> {
  key: T;
  label: string;
}

interface TabBarProps<T extends string> {
  tabs: Tab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

export const TabBar = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: TabBarProps<T>) => {
  const { tk } = useTheme();

  return (
    <View style={[styles.tabs, { borderBottomColor: tk.border.default }]}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onTabChange(tab.key)}
          style={[
            styles.tab,
            activeTab === tab.key && {
              borderBottomColor: tk.primary[500],
              borderBottomWidth: 2,
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === tab.key ? tk.primary[400] : tk.text.muted,
              },
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
