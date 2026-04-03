import { Line, Svg } from 'react-native-svg';

interface MinusIconProps {
  size?: number;
  color?: string;
}

export const MinusIcon = ({ size = 16, color = 'currentColor' }: MinusIconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke={color}
    strokeWidth={2.5}
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <Line x1={5} y1={12} x2={19} y2={12} />
  </Svg>
);
