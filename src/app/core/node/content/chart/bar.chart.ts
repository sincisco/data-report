import {Chart} from './chart';
import {Title} from './echart.interface/title';
import {Axis} from './echart.interface/axis';
import {Grid} from './echart.interface/grid';
import {BarSeriesConfig} from './echart.interface/series/bar.series';
import {ChartGraphic} from '../../graphic/chart.graphic';

import {BarConfigComponent} from '../../../../layout/sider/graphic.config/chart/bar.config.component';

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

  configClass = BarConfigComponent;

  constructor(chartGraphic: ChartGraphic) {
    super(chartGraphic);
  }

  derender() {
    return {
      contentClass: 'bar.chart',
      option: this._option
    };
  }

  destroy() {
    delete this.configClass;
    super.destroy();
  }

}
