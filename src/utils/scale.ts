import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

const TYPOGRAPHY_DEVIATION_AMPLIFIER = 5;
const LAYOUT_DEVIATION_AMPLIFIER = 2;

/**
 * Linear scale based on screen width with amplified deviation.
 * Use for layout dimensions: widths, heights, fixed paddings, icon sizes.
 */

export const scale = (size: number): number => {
  const rawRatio = Math.min(SCREEN_WIDTH / BASE_WIDTH, 1.0);
  const ratio = Math.max(1 - (1 - rawRatio) * LAYOUT_DEVIATION_AMPLIFIER, 0.6);
  const scaled = Math.round(ratio * size);
  return rawRatio < 1.0 && size > 6 ? scaled - 1 : scaled;
};

/**
 * Linear scale based on screen height, capped at 1.0.
 * Use for vertical-only dimensions: large bottom paddings for tab bar / FAB clearance.
 */
export const verticalScale = (size: number): number => {
  const ratio = Math.min(SCREEN_HEIGHT / BASE_HEIGHT, 1.0);
  return Math.round(ratio * size);
};

/**
 * Dampened scale with amplified deviation.
 * The raw screen difference is multiplied by DEVIATION_AMPLIFIER so that
 * small but real differences (e.g. P30 360dp vs iPhone 17 393dp) survive
 * Math.round and produce visible changes.
 * Capped at 1.0 so larger screens are unaffected.
 * Use for typography and spacing.
 *
 * @param size   - Reference size (at 393dp base width)
 * @param factor - Dampening factor (0 = no scaling, 1 = full amplified). Default 0.5.
 */

export const moderateScale = (size: number, factor = 0.5): number => {
  const rawRatio = Math.min(SCREEN_WIDTH / BASE_WIDTH, 1.0);
  const ratio = Math.max(
    1 - (1 - rawRatio) * TYPOGRAPHY_DEVIATION_AMPLIFIER,
    0.6,
  );
  const scaled = Math.round(size + (ratio * size - size) * factor);
  // On smaller screens apply an extra -1dp so differences are clearly visible.
  // Guard: only for values > 6 so tiny spacings (4dp) aren't disproportionately affected.
  return rawRatio < 1.0 && size > 6 ? scaled - 1 : scaled;
};
