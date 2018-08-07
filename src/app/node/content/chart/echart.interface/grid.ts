/**
 * 直角坐标系内绘图网格，单个 grid 内最多可以放置上下两个 X 轴，左右两个 Y 轴。
 * 可以在网格上绘制折线图，柱状图，散点图（气泡图）。
 */
import {Shadow} from './common';

export interface Grid extends Shadow {
  id?: string;
  // [ default: false ]
  // 是否显示直角坐标系网格。
  show?: false;
  zlevel?: number;
  z?: number;
  left?: number | string;
  right?: number | string;
  top?: number | string;
  bottom?: number | string;
  width?: number | string;
  height?: number | string;
  containLabel?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  borderWidth?: number;

}

