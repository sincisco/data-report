import {RegionController} from '../../region/region.controller';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';
import {Grid} from '../../graphic.view/chart/echart.interface/grid';
import {Axis} from '../../graphic.view/chart/echart.interface/axis';
import {Title} from '../../graphic.view/chart/echart.interface/title';
import {LineSeriesConfig} from '../../graphic.view/chart/echart.interface/series/line.series';
import {LinesChart} from '../../graphic.view/chart/lines.chart';
import {ChartGraphic} from '@core/node/graphic/chart.graphic/chart.graphic';
import {LineConfigComponent} from '../../../../components/graphic.config/chart/line.config.component';

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
    this._chart = new LinesChart(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(LineConfigComponent);
    if (option) {
      this.configModel.importOption(option);
    }
    this.configModel.graphic = this;
  }

  getOption() {
    return {
      graphicClass: 'lines.chart.graphic',
      option: this.configModel.exportOption()
    };
  }

}
