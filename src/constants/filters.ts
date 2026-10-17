import { StyleSheet } from 'react-native';

/**
 * Returns an absolutely-positioned overlay style that desaturates the image
 * behind it by `amount` (0 = full colour, 1 = full grayscale).
 *
 * How it works (CSS mix-blend-mode: color):
 *   The 'color' blend mode takes hue + saturation from the source (this white
 *   overlay, saturation = 0%) and luminance from the backdrop (the image).
 *   The overlay's opacity controls how strongly the desaturation is applied.
 *
 * Usage:
 *   <View style={containerStyle}>     ← needs overflow: 'hidden'
 *     <Image ... />
 *     <View style={filters.grayscaleOverlay(0.85)} />
 *   </View>
 */
export const filters = {
  grayscaleOverlay: (amount = 0.4) => ({
    ...StyleSheet.absoluteFill,
    backgroundColor: '#ffffff',
    mixBlendMode: 'color' as const,
    opacity: amount,
  }),
} as const;
