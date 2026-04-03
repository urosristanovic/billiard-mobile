import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { spacing, typography } from '@/constants/theme';

export interface TabBarItem<T extends string> {
  key: T;
  label: string;
}

interface TabBarProps<T extends string> {
  tabs: TabBarItem<T>[];
  activeTab: T;
  onTabChange: (key: T) => void;
  style?: ViewStyle;
  scrollable?: boolean;
}

export const TabBar = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
  style,
  scrollable = false,
}: TabBarProps<T>) => {
  const { tk } = useTheme();

  const items = tabs.map(tab => (
    <TouchableOpacity
      key={tab.key}
      onPress={() => onTabChange(tab.key)}
      style={[
        styles.tabItem,
        {
          borderBottomColor:
            activeTab === tab.key ? tk.primary[500] : 'transparent',
        },
      ]}
      accessibilityRole='tab'
      accessibilityState={{ selected: activeTab === tab.key }}
    >
      <Text
        style={[
          styles.tabText,
          { color: activeTab === tab.key ? tk.text.primary : tk.text.muted },
        ]}
      >
        {tab.label}
      </Text>
    </TouchableOpacity>
  ));

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[{ borderBottomColor: tk.border.subtle }, style]}
        contentContainerStyle={styles.scrollContent}
      >
        {items}
      </ScrollView>
    );
  }

  return (
    <View
      style={[styles.tabBar, { borderBottomColor: tk.border.subtle }, style]}
    >
      {items}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    marginBottom: spacing[2],
  },
  scrollContent: {
    flexDirection: 'row',
    gap: spacing[5],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
  },
  tabItem: {
    paddingHorizontal: spacing[3],
    paddingBottom: spacing[2],
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.normal,
  },
});
