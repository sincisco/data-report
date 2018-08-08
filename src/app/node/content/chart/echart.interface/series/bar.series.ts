import {CartesionEncode} from './common';
import {Animation} from '../common';

export interface BarSeriesConfig extends Animation {
  type: 'bar';
  id?: string;
  name?: string;
  legendHoverLink?: boolean;
  coordinateSystem?: 'cartesian2d';
  xAxisIndex?: number;
  yAxisIndex?: number;
  label?: any;
  itemStyle?: any;
  emphasis?: any;
  stack?: string;
  cursor?: string;
  barWidth?: number | string;
  barMaxWidth?: number | string;
  barMinHeight?: number;
  barGap?: string;
  barCategoryGap?: string;
  large?: boolean;
  largeThreshold?: number;
  progressive?: number;
  progressiveThreshold?: number;
  progressiveChunkMode?: string;
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


