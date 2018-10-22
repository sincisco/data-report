import {RegionController} from '../../region/region.controller';
import {Grid} from '../../graphic.view/chart/echart.interface/grid';
import {BarSeriesConfig} from '../../graphic.view/chart/echart.interface/series/bar.series';
import {Axis} from '../../graphic.view/chart/echart.interface/axis';
import {Title} from '../../graphic.view/chart/echart.interface/title';

import {BarConfigComponent} from '../../../../components/graphic.config/chart/bar.config.component';
import {ChartGraphic} from '@core/node/graphic/chart/chart.graphic';


export interface ChartBarOption {
  title?: Title;
  tooltip?: any;
  dataset?: any;
  grid?: Grid;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<BarSeriesConfig>;
  color?: Array<string>;
}

export class BarChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }

  init(option?: any) {
    this._init(BarConfigComponent, option);
  }

  getOption() {
    return {
      graphicClass: 'bar.chart.graphic',
      option: this.configSource.exportOption()
    };
  }

}
