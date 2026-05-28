import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradients, spacing } from '@/constants/theme';

interface ScreenLayoutProps {
  children: React.ReactNode;
  isDark?: boolean;
  withGradientHeader?: boolean;
  header?: React.ReactNode;
  /** Enable for screens without a tab bar (auth, modals). Tab screens keep this off. */
  includeBottomInset?: boolean;
}

export const ScreenLayout = ({
  children,
  isDark = false,
  withGradientHeader = false,
  header,
  includeBottomInset = false,
}: ScreenLayoutProps) => {
  const t = isDark ? theme.dark : theme.light;
  const g = isDark ? gradients.dark : gradients.light;
  const edges = includeBottomInset
    ? (['top', 'left', 'right', 'bottom'] as const)
    : (['top', 'left', 'right'] as const);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: t.background.primary }]}
      edges={edges}
    >
      {header &&
        (withGradientHeader ? (
          <LinearGradient
            colors={g.header as [string, string, ...string[]]}
            style={styles.header}
          >
            {header}
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.header,
              {
                backgroundColor: t.surface.default,
                borderBottomColor: t.primary[800],
                borderBottomWidth: 1,
              },
            ]}
          >
            {header}
          </View>
        ))}
      <View style={[styles.content, { backgroundColor: t.background.primary }]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
  },
});
