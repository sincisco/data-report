import {Animation} from '../common';

export interface PieSeriesConfig extends Animation {
  type: 'pie';
  id?: string;
  name?: string;
  legendHoverLink?: boolean;
  hoverAnimation?: boolean;
  hoverOffset?: number;
  selectedMode?: boolean;
  selectedOffset?: number;
  clockwise?: boolean;
  startAngle?: number;
  minAngle?: number;
  roseType?: boolean;
  avoidLabelOverlap?: boolean;
  stillShowZeroSum?: boolean;
  label?: any;
  itemStyle?: any;
  emphasis?: any;
  cursor?: string;
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


