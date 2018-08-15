import {Chart} from './chart';
import {BarConfigComponent} from '../../../../layout/sider/graphic.config/chart/bar.config.component';
import * as _ from 'lodash';
import {Title} from './echart.interface/title';
import {Axis} from './echart.interface/axis';
import {Grid} from './echart.interface/grid';
import {BarSeriesConfig} from './echart.interface/series/bar.series';
import {ChartGraphic} from '../../graphic/chart.graphic';

export interface ChartBarOption {
  title?: Title;
  dataset?: any;
  grid?: Grid;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<BarSeriesConfig>;
  color?: Array<string>;
}


export class BarChart extends Chart {

  static config = BarConfigComponent;

  configClass = BarConfigComponent;

  constructor(chartGraphic: ChartGraphic) {
    super(chartGraphic);
  }

  destroy() {
    delete this.configClass;
    super.destroy();
  }

}
