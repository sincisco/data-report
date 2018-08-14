import {TextStyle} from './text.style';

type Target = 'self' | 'blank';

/**
 *
 */
export interface Title {
  id?: string;
  show?: boolean; // default: true
  text?: string;
  link?: string;
  target?: Target; // default: 'blank'
  textStyle?: TextStyle;
  subtext?: string;
  sublink?: string;
  subtarget?: Target;
  subtextStyle?: TextStyle;
  // 标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。
  padding?: number | Array<number>;
  // [ default: 10 ]
  // 主副标题之间的间距。
  itemGap?: number;
  left?: 'auto' | 'left' | 'center' | 'top' | number | string;
  right?: 'auto' | number | string;
  top?: 'auto' | 'top' | 'middle' | 'bottom' | number | string;
  bottom?: 'auto' | number | string;
  backgroundColor?: string;
  // [ default: '#ccc' ]
  // 标题的边框颜色。支持的颜色格式同 backgroundColor。
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number | Array<number>;
  // 图形阴影的模糊大小。
  // 该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
  shadowBlur?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}
