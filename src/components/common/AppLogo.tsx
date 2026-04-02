import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { typography, radius } from '@/constants/theme';

export const AppLogo = () => {
  const { tk } = useTheme();

  return (
    <View style={styles.row}>
      {/* 8-ball mark */}
      <View style={styles.ballShadowWrap}>
        <LinearGradient
          colors={[tk.primary[400], tk.primary[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ballOuter}
        >
          <View
            style={[
              styles.ballInner,
              { backgroundColor: tk.background.primary },
            ]}
          >
            <Text style={[styles.ballNumber, { color: tk.primary[500] }]}>
              8
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Wordmark */}
      <Text style={styles.wordmark}>
        <Text style={{ color: '#FFFFFF' }}>Billiard</Text>
        <Text style={{ color: tk.primary[500] }}>Tracker</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ballShadowWrap: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
    borderRadius: radius.full,
  },
  ballOuter: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(253, 211, 77, 0.3)',
  },
  ballInner: {
    width: 16,
    height: 16,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballNumber: {
    fontSize: 10,
    fontFamily: typography.family.display,
    lineHeight: 14,
  },
  wordmark: {
    fontSize: typography.size.xl,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
