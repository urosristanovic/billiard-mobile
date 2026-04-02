import { Circle, Line, Svg } from 'react-native-svg';

interface CueIconProps {
  size?: number;
  color?: string;
}

export const CueIcon = ({ size = 24, color = 'currentColor' }: CueIconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke={color}
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    {/* Cue ball outline */}
    <Circle cx={7} cy={17} r={3} />
    {/* Cue ball center dot */}
    <Circle cx={7} cy={17} r={1} fill={color} stroke='none' />
    {/* Cue stick (thin) */}
    <Line x1={11} y1={13} x2={22} y2={2} strokeWidth={2} />
    {/* Cue butt / thick end */}
    <Line x1={17} y1={7} x2={22} y2={2} strokeWidth={4} />
  </Svg>
);
