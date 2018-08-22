import {Chart} from './chart';
import * as _ from 'lodash';
import {Title} from './echart.interface/title';
import {Axis} from './echart.interface/axis';
import {Grid} from './echart.interface/grid';
import {ChartGraphic} from '../../graphic/chart.graphic';
import {PieSeriesConfig} from '@core/node/content/chart/echart.interface/series/pie.series';
import {PieConfigComponent} from '../../../../layout/sider/graphic.config/chart/pie.config.component';

export interface ChartPieConfig {
  title?: Title;
  dataset?: any;
  grid?: Grid;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<PieSeriesConfig>;
  color?: Array<string>;
}


export class PieChart extends Chart {

  configClass = PieConfigComponent;

  constructor(chartGraphic: ChartGraphic) {
    super(chartGraphic);
  }

  derender() {
    return {
      contentClass: 'pie.chart',
      option: this._option
    };
  }

  destroy() {
    delete this.configClass;
    super.destroy();
  }

}
