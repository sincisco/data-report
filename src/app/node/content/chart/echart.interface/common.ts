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

export interface Animation {
  // [ default: true ]
  // 是否开启动画。
  animation?: boolean;
  // [ default: 2000 ]
  // 是否开启动画的阈值，当单个系列显示的图形数量大于这个阈值时会关闭动画。
  animationThreshold?: number;
  // [ default: 1000 ]
  // 初始动画的时长，支持回调函数，可以通过每个数据返回不同的 delay 时间实现更戏剧的初始动画效果：
  animationDuration?: number | Function;
  // [ default: cubicOut ]
  // 初始动画的缓动效果。不同的缓动效果可以参考 缓动示例。
  animationEasing?: string;
  // [ default: 0 ]
  // 初始动画的延迟，支持回调函数，可以通过每个数据返回不同的 delay 时间实现更戏剧的初始动画效果。
  animationDelay?: number | Function;
  // [ default: 300 ]
  // 数据更新动画的时长。
  // 支持回调函数，可以通过每个数据返回不同的 delay 时间实现更戏剧的更新动画效果：
  animationDurationUpdate?: number | Function;
  // [ default: cubicOut ]
  // 数据更新动画的缓动效果。
  animationEasingUpdate?: string;
  // [ default: 0 ]
  // 数据更新动画的延迟，支持回调函数，可以通过每个数据返回不同的 delay 时间实现更戏剧的更新动画效果
  animationDelayUpdate?: number | Function;
}
