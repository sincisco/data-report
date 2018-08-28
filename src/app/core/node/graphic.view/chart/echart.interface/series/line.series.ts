import {CartesionEncode} from './common';
import {Animation} from '@core/node/graphic.view/chart/echart.interface/common';

export interface LineSeriesConfig extends Animation {
  type: 'line';
  id?: string;
  // 系列名称，用于tooltip的显示，legend 的图例筛选，
  // 在 setOption 更新数据和配置项时用于指定对应的系列。
  name?: string;
  legendHoverLink?: boolean;
  coordinateSystem?: 'cartesian2d' | 'polar';
  xAxisIndex?: number;
  yAxisIndex?: number;
  // 使用的极坐标系的 index，在单个图表实例中存在多个极坐标系的时候有用。
  polarIndex?: number;
  symbol?: 'emptyCircle' | 'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow' | 'none';
  symbolSize?: number | Array<number>;
  symbolRotate?: number;
  symbolKeepAspect?: boolean;
  symbolOffset?: Array<number>;
  showSymbol?: boolean;
  showAllSymbol?: boolean;
  hoverAnimation?: boolean;
  label?: any;
  itemStyle?: any;
  emphasis?: any;
  stack?: string;
  cursor?: string;
  connectNulls?: boolean;
  clipOverflow?: boolean;
  step?: boolean | 'start' | 'middle' | 'end';
  smooth?: boolean;
  smoothMonotone?: 'x' | 'y' | 'none';
  sampling?: 'average' | 'max' | 'min' | 'sum';
  dimensions?: Array<any>;
  encode?: CartesionEncode;
  seriesLayoutBy?: 'column' | 'row';
  datasetIndex?: number;
  data?: Array<any>;
  markPoint?: any;
  markLine?: any;
  markArea?: any;
  zlevel?: number;
  z?: number;
  silent?: false;
  tooltip?: any;
}
