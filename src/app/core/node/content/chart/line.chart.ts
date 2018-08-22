import {Chart} from './chart';
import * as _ from 'lodash';
import {Title} from './echart.interface/title';
import {Axis} from './echart.interface/axis';
import {Grid} from './echart.interface/grid';
import {ChartGraphic} from '../../graphic/chart.graphic';
import {LineConfigComponent} from '../../../../layout/sider/graphic.config/chart/line.config.component';
import {LineSeriesConfig} from '@core/node/content/chart/echart.interface/series/line.series';

export interface ChartLineOption {
  title?: Title;
  dataset?: any;
  grid?: Grid;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<LineSeriesConfig>;
  color?: Array<string>;
}


export class LineChart extends Chart {

  configClass = LineConfigComponent;

  constructor(chartGraphic: ChartGraphic) {
    super(chartGraphic);
  }

  derender() {
    return {
      contentClass: 'line.chart',
      option: this._option
    };
  }

  destroy() {
    delete this.configClass;
    super.destroy();
  }

}
