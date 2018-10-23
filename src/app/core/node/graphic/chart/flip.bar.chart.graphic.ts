import {RegionController} from '@core/node/region/region.controller';
import {ChartGraphic} from '@core/node/graphic/chart/chart.graphic';

export class FlipBarChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }
}
