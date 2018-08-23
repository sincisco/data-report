import {Region} from '../../region/region';
import {Chart} from '../../content/chart/chart';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';
import {BarConfigComponent} from '../../../../layout/sider/graphic.config/chart/bar.config.component';
import {Grid} from '../../content/chart/echart.interface/grid';
import {BarSeriesConfig} from '../../content/chart/echart.interface/series/bar.series';
import {Axis} from '../../content/chart/echart.interface/axis';
import {Title} from '../../content/chart/echart.interface/title';
import {ChartGraphic} from '@core/node/graphic/chart.graphic/chart.graphic';

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
  constructor(region: Region) {
    super(region);
  }

  init(option?: any) {
    this._chart = new Chart(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(BarConfigComponent);
    if (option) {
      this._configComponentRef.instance.writeOption(option);
    }
    this._configComponentRef.instance.graphic = this;
  }

  derender() {
    return {
      graphicClass: 'bar.chart.graphic',
      option: this._configComponentRef.instance.readOption(),
    };
  }

}
