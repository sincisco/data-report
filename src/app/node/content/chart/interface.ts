type AxisType = 'category' | 'value' | 'time' | 'log';

export interface AxisLabel {
  rotate?: number;
}

export interface AxisTick {
  show?: boolean;
  alignWithLabel?: boolean;
  interval?: number | Function | 'auto';
  inside?: boolean;
  length?: number;
}


export interface IAxis {
  // 组件 ID。默认不指定。指定则可用于在 option 或者 API 中引用组件。
  id?: string;
  // [ default: true ]
  // 是否显示 x 轴。
  show?: boolean;
  // [ default: 0 ]
  // x 轴所在的 grid 的索引，默认位于第一个 grid。
  gridIndex?: number;
  // 默认 grid 中的第一个 x 轴在 grid 的下方（'bottom'），第二个 x 轴视第一个 x 轴的位置放在另一侧。
  position?: 'top' | 'bottom' | undefined | null;
  name?: string;
  nameLocation?: 'start' | 'middle' | 'end';
  nameGap?: number;
  nameRotate?: number;
  type?: AxisType;
  silent?: boolean;
  axisLabel?: AxisLabel;
  axisTick?: AxisTick;
}

interface ChartLineItem {
  name?: string;
  type: 'line';
  stack?: string;
  encode?: CartesionEncode;
}

export interface ChartBarItem {
  name?: string;
  type: 'bar';
  stack?: string;
  encode?: CartesionEncode;
}


interface Encode {
  tooltip?: number | string | Array<string | number>;
  itemName?: number | string | Array<string | number>;
}

interface CartesionEncode extends Encode {
  x?: number | string | Array<string | number>;
  y?: number | string | Array<string | number>;
}

interface PolarEncode extends Encode {
  radius?: number | string | Array<string | number>;
  angle?: number | string | Array<string | number>;
}

interface GEOEncode extends Encode {
  lng?: number | string | Array<string | number>;
  lat?: number | string | Array<string | number>;
}
