import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

const TRACK_W = 56;
const TRACK_H = 28;
const THUMB = 22;
const MARGIN = (TRACK_H - THUMB) / 2;
const TRAVEL = TRACK_W - THUMB - MARGIN * 2;

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackColor?: { false: string; true: string };
  thumbColor?: string;
  disabled?: boolean;
}

export const ToggleSwitch = ({
  value,
  onValueChange,
  trackColor,
  thumbColor = '#fff',
  disabled = false,
}: ToggleSwitchProps) => {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    }).start();
  }, [value, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [MARGIN, MARGIN + TRAVEL],
  });

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [trackColor?.false ?? '#ccc', trackColor?.true ?? '#4CAF50'],
  });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      accessibilityRole='switch'
      accessibilityState={{ checked: value, disabled }}
      style={disabled ? styles.disabled : undefined}
      hitSlop={8}
    >
      <Animated.View style={[styles.track, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.thumb,
            { backgroundColor: thumbColor, transform: [{ translateX }] },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  disabled: {
    opacity: 0.4,
  },
});
