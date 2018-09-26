import {RegionController} from '../../../region/region.controller';
import {Chart} from '../../../graphic.view/chart/chart';
import {siderLeftComponent} from '../../../../../layout/sider/sider.left.component';
import {Grid} from '../../../graphic.view/chart/echart.interface/grid';
import {Axis} from '../../../graphic.view/chart/echart.interface/axis';
import {Title} from '../../../graphic.view/chart/echart.interface/title';
import {LineSeriesConfig} from '../../../graphic.view/chart/echart.interface/series/line.series';

import {ChartGraphic} from '@core/node/graphic/design/chart.graphic/chart.graphic';
import {LineConfigComponent} from '../../../../../components/graphic.config/chart/line.config.component';

export interface ChartLineOption {
  title?: Title;
  dataset?: any;
  grid?: Grid;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<LineSeriesConfig>;
  color?: Array<string>;
}

export class LineChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }

  init(option?: any) {
    this._init(LineConfigComponent, option);
  }

  getOption() {
    return {
      graphicClass: 'line.chart.graphic',
      option: this.configSource.exportOption()
    };
  }

}
