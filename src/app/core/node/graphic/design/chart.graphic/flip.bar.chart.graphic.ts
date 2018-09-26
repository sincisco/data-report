import {Title} from '../../../graphic.view/chart/echart.interface/title';
import {Grid} from '../../../graphic.view/chart/echart.interface/grid';
import {Axis} from '../../../graphic.view/chart/echart.interface/axis';
import {ChartGraphic} from '@core/node/graphic/design/chart.graphic/chart.graphic';
import {RegionController} from '../../../region/region.controller';
import {LineSeriesConfig} from '../../../graphic.view/chart/echart.interface/series/line.series';
import {Chart} from '../../../graphic.view/chart/chart';
import {siderLeftComponent} from '../../../../../layout/sider/sider.left.component';
import {FlipBarConfigComponent} from '../../../../../components/graphic.config/chart/flip.bar.config.component';


export interface ChartLineOption {
  title?: Title;
  dataset?: any;
  grid?: Grid;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<LineSeriesConfig>;
  color?: Array<string>;
}

export class FlipBarChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }


  init(option?: any) {
    this._chart = new Chart(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(FlipBarConfigComponent);
    if (option) {
      this.configSource.importOption(option);
    }
    this.configSource.register('option', (key, oldValue, newValue) => {
      this.update(newValue);
    });
  }

  getOption() {
    return {
      graphicClass: 'ring.chart.graphic',
      option: this.configSource.exportOption()
    };
  }

}
