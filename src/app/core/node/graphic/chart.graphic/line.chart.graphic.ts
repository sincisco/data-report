import {Region} from '../../region/region';
import {Chart} from '../../content/chart/chart';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';
import {Grid} from '../../content/chart/echart.interface/grid';
import {Axis} from '../../content/chart/echart.interface/axis';
import {Title} from '../../content/chart/echart.interface/title';
import {LineSeriesConfig} from '../../content/chart/echart.interface/series/line.series';

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

export class LineChartGraphic extends ChartGraphic {
  constructor(region: Region) {
    super(region);
  }

  init(option?: any) {
    this._chart = new Chart(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(LineConfigComponent);
    if (option) {
      this.configModel.writeOption(option);
    }
    this.configModel.graphic = this;
  }

  getOption() {
    return {
      graphicClass: 'line.chart.graphic',
      option: this.configModel.readOption()
    };
  }

}
