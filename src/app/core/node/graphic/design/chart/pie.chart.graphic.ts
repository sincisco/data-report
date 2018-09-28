import {RegionController} from '../../../region/region.controller';
import {Chart} from '../../../graphic.view/chart/chart';
import {siderLeftComponent} from '../../../../../layout/sider/sider.left.component';

import {ChartGraphic} from '@core/node/graphic/design/chart/chart.graphic';
import {Title} from '../../../graphic.view/chart/echart.interface/title';
import {Grid} from '../../../graphic.view/chart/echart.interface/grid';
import {Axis} from '../../../graphic.view/chart/echart.interface/axis';
import {PieSeriesConfig} from '../../../graphic.view/chart/echart.interface/series/pie.series';
import {PieConfigComponent} from '../../../../../components/graphic.config/chart/pie.config.component';

export interface ChartPieConfig {
  title?: Title;
  dataset?: any;
  grid?: Grid;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<PieSeriesConfig>;
  color?: Array<string>;
}

export class PieChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }

  init(option?: any) {
    this._init(PieConfigComponent, option);
  }

  getOption() {
    return {
      graphicClass: 'pie.chart.graphic',
      option: this.configSource.exportOption()
    };
  }

}