import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, radius } from '@/constants/theme';

const TAB_ICONS: Record<string, React.ComponentProps<typeof Feather>['name']> =
  {
    Home: 'home',
    Tournaments: 'award',
    Leaderboard: 'bar-chart-2',
  };

const TAB_LABELS: Record<string, string> = {
  Home: 'home:tab',
  Tournaments: 'tournaments:tab',
  Leaderboard: 'leaderboard:title',
};

const TabItem = ({
  routeName,
  isFocused,
  onPress,
}: {
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
}) => {
  const { tk } = useTheme();
  const { t } = useTranslation();

  const translateY = useRef(new Animated.Value(0)).current;
  const labelOpacity = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: isFocused ? -4 : 0,
        useNativeDriver: true,
        friction: 6,
      }),
      Animated.timing(labelOpacity, {
        toValue: isFocused ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);

  const iconName = TAB_ICONS[routeName];
  const labelKey = TAB_LABELS[routeName];
  const label = labelKey ? t(labelKey) : routeName;

  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole='tab'
      accessibilityState={{ selected: isFocused }}
      style={styles.tabItem}
    >
      <Animated.View
        style={{ alignItems: 'center', gap: 6, transform: [{ translateY }] }}
      >
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: isFocused
                ? `${tk.primary[500]}1A`
                : 'transparent',
            },
          ]}
        >
          <Feather
            name={iconName}
            size={28}
            color={isFocused ? tk.primary[500] : tk.text.muted}
            strokeWidth={isFocused ? 2.5 : 2}
          />
        </View>

        <Animated.Text
          style={[
            styles.label,
            {
              color: tk.primary[500],
              opacity: labelOpacity,
            },
          ]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const { tk } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: tk.background.primary,
          borderTopColor: tk.border.default,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabItem
            key={route.key}
            routeName={route.name}
            isFocused={isFocused}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: spacing[4],
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[1],
  },
  iconWrap: {
    padding: spacing[3],
    borderRadius: radius['full'],
  },
  label: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
