import {RegionController} from '@core/node/region/region.controller';
import {ChartGraphic} from '@core/node/graphic/chart/chart.graphic';

import {Grid} from '../../graphic.view/chart/echart.interface/grid';
import {Axis} from '../../graphic.view/chart/echart.interface/axis';
import {Title} from '../../graphic.view/chart/echart.interface/title';
import {LineSeriesConfig} from '../../graphic.view/chart/echart.interface/series/line.series';
import {GraphicWrapper} from '@core/node/graphic/graphic.wrapper';

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

  init(region: RegionController, wrapper: GraphicWrapper) {
    super.init();
    region.addMethod('desc', () => {
      return {
        id: wrapper.uuid,
        displayName: `折线图 ${wrapper.uuid}`,
        icon: 'u-icn-chart-line'
      };
    });
  }
}
