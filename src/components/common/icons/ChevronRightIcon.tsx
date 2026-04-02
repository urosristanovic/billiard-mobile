import { Polyline, Svg } from 'react-native-svg';

interface ChevronRightIconProps {
  size?: number;
  color?: string;
}

export const ChevronRightIcon = ({ size = 16, color = 'currentColor' }: ChevronRightIconProps) => (
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
    <Polyline points='9 18 15 12 9 6' />
  </Svg>
);
