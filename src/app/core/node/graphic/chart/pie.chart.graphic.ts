import {RegionController} from '@core/node/region/region.controller';
import {ChartGraphic} from '@core/node/graphic/chart/chart.graphic';

import {Title} from '../../graphic.view/chart/echart.interface/title';
import {Grid} from '../../graphic.view/chart/echart.interface/grid';
import {Axis} from '../../graphic.view/chart/echart.interface/axis';
import {PieSeriesConfig} from '../../graphic.view/chart/echart.interface/series/pie.series';

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
}
