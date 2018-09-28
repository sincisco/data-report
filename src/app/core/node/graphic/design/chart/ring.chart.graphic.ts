import {Title} from '../../../graphic.view/chart/echart.interface/title';
import {Grid} from '../../../graphic.view/chart/echart.interface/grid';
import {Axis} from '../../../graphic.view/chart/echart.interface/axis';
import {ChartGraphic} from '@core/node/graphic/design/chart/chart.graphic';
import {RegionController} from '../../../region/region.controller';
import {LineSeriesConfig} from '../../../graphic.view/chart/echart.interface/series/line.series';
import {Chart} from '../../../graphic.view/chart/chart';
import {RingConfigComponent} from '../../../../../components/graphic.config/chart/ring.config.component';
import {session} from '@core/node/utils/session';


export interface ChartLineOption {
  title?: Title;
  dataset?: any;
  grid?: Grid;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<LineSeriesConfig>;
  color?: Array<string>;
}

export class RingChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }


  init(option?: any) {
    this._chart = new Chart(this);
    this._configComponentRef = session.siderLeftComponent.forwardCreateGraphicConfig(RingConfigComponent);
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
