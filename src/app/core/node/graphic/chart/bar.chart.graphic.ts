import {RegionController} from '@core/node/region/region.controller';
import {ChartGraphic} from '@core/node/graphic/chart/chart.graphic';

import {Grid} from '../../graphic.view/chart/echart.interface/grid';
import {BarSeriesConfig} from '../../graphic.view/chart/echart.interface/series/bar.series';
import {Axis} from '../../graphic.view/chart/echart.interface/axis';
import {Title} from '../../graphic.view/chart/echart.interface/title';
import {GraphicWrapper} from '@core/node/graphic/graphic.wrapper';


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

  init(region: RegionController, wrapper: GraphicWrapper) {
    super.init();
    region.addMethod('desc', () => {
      return {
        id: wrapper.uuid,
        displayName: `柱状图 ${wrapper.uuid}`,
        icon: 'u-icn-chart-bar'
      };
    });
  }
}
