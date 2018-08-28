type FontStyle = 'normal' | 'italic' | 'oblique';
type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | number;
type FontFamily = 'serif' | 'monospace' | 'Arial' | 'Courier New' | 'Microsoft YaHei';
type Align = 'left' | 'center' | 'right';
type VerticalAlign = 'top' | 'middle' | 'bottom';

/**
 * user:
 * title.textTitle
 * title.subtextStyle
 */
export interface TextStyle {
  color?: string;
  fontStyle?: FontStyle;
  fontWeight?: FontWeight;
  fontFamily?: FontFamily;
  fontSize?: number;
  align?: Align;
  vertical?: VerticalAlign;
  lineHeight?: number;
  width?: number | string;
  height?: number | string;
  textBorderColor?: string;
  textBorderWidth?: number;
  textShadowColor?: string;
  textShadowBlur?: number;
  textShadowOffsetX?: number;
  textShadowOffsetY?: number;
}
