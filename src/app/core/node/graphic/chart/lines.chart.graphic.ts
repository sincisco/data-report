import {RegionController} from '../../region/region.controller';
import {Grid} from '../../graphic.view/chart/echart.interface/grid';
import {Axis} from '../../graphic.view/chart/echart.interface/axis';
import {Title} from '../../graphic.view/chart/echart.interface/title';
import {LineSeriesConfig} from '../../graphic.view/chart/echart.interface/series/line.series';
import {LineConfigComponent} from '../../../../components/graphic.config/chart/line.config.component';
import {session} from '../../utils/session';
import {ChartGraphic} from '@core/node/graphic/chart/chart.graphic';

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
  constructor(region: RegionController) {
    super(region);
  }

  init(option?: any) {
    // this._chart = new LinesChart(this);
    this._configComponentRef = session.siderLeftComponent.forwardCreateGraphicConfig(LineConfigComponent);
    if (option) {
      this.configSource.importOption(option);
    }
  }

  getOption() {
    return {
      graphicClass: 'lines.chart.graphic',
      option: this.configSource.exportOption()
    };
  }

}
