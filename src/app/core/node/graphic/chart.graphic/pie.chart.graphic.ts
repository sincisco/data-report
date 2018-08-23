import {Region} from '../../region/region';
import {Chart} from '../../content/chart/chart';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';
import {Grid} from '../../content/chart/echart.interface/grid';
import {Axis} from '../../content/chart/echart.interface/axis';
import {Title} from '../../content/chart/echart.interface/title';
import {PieSeriesConfig} from '../../content/chart/echart.interface/series/pie.series';
import {PieConfigComponent} from '../../../../layout/sider/graphic.config/chart/pie.config.component';
import {ChartGraphic} from '@core/node/graphic/chart.graphic/chart.graphic';

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
  constructor(region: Region) {
    super(region);
  }

  init() {
    this._chart = new Chart(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(PieConfigComponent);
    this._configComponentRef.instance.graphic = this;
  }

}
