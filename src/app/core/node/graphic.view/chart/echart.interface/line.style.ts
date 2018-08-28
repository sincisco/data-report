type BorderType = 'solid' | 'dashed' | 'dotted';

/**
 * user:
 * axis.axisLine.lineStyle
 * axis.axisTick.lineStyle
 * axis.splitLine.lineStyle
 */
export interface LineStyle {
  color?: string;
  width?: number;
  type?: BorderType;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  opacity: number;
}
