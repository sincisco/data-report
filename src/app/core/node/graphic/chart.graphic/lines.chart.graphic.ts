import {Region} from '../../region/region';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';
import {Grid} from '../../content/chart/echart.interface/grid';
import {Axis} from '../../content/chart/echart.interface/axis';
import {Title} from '../../content/chart/echart.interface/title';
import {LineSeriesConfig} from '../../content/chart/echart.interface/series/line.series';
import {LineConfigComponent} from '../../../../layout/sider/graphic.config/chart/line.config.component';
import {LinesChart} from '../../content/chart/lines.chart';
import {ChartGraphic} from '@core/node/graphic/chart.graphic/chart.graphic';

export interface ChartLineOption {
  title?: Title;
  dataset?: any;
  grid?: Grid;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<LineSeriesConfig>;
  color?: Array<string>;
}

export class LinesChartGraphic extends ChartGraphic {
  constructor(region: Region) {
    super(region);
  }

  init() {
    this._chart = new LinesChart(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(LineConfigComponent);
    this._configComponentRef.instance.graphic = this;
  }

}
