import {RegionController} from '../../region/region.controller';
import {Chart} from '../../graphic.view/chart/chart';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';
import {Grid} from '../../graphic.view/chart/echart.interface/grid';
import {BarSeriesConfig} from '../../graphic.view/chart/echart.interface/series/bar.series';
import {Axis} from '../../graphic.view/chart/echart.interface/axis';
import {Title} from '../../graphic.view/chart/echart.interface/title';
import {ChartGraphic} from '@core/node/graphic/chart.graphic/chart.graphic';
import {BarConfigComponent} from '../../../../components/graphic.config/chart/bar.config.component';

export interface ChartBarOption {
  title?: Title;
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

  init(option?: any) {
    this._chart = new Chart(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(BarConfigComponent);
    if (option) {
      this.configModel.importOption(option);
    }
    this.configModel.graphic = this;
  }

  getOption() {
    return {
      graphicClass: 'bar.chart.graphic',
      option: this.configModel.exportOption()
    };
  }

}
