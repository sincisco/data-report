export type FontStyle = 'normal' | 'italic' | 'oblique';
export type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | number;
export type FontFamily = 'serif' | 'monospace' | 'Arial' | 'Courier New' | 'Microsoft YaHei';
export type Align = 'left' | 'center' | 'right';
export type VerticalAlign = 'top' | 'middle' | 'bottom';

export interface Shadow {
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}


export interface TextShadow {
  textShadowColor?: string;
  textShadowBlur?: number;
  textShadowOffsetX?: number;
  textShadowOffsetY?: number;
}

export interface Border {
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number | Array<number>;
}

export interface Font {
  color?: string;
  fontStyle?: FontStyle;
  fontWeight?: FontWeight;
  fontFamily?: FontFamily;
  fontSize?: number;
  align?: Align;
  vertical?: VerticalAlign;
  lineHeight?: number;
}
