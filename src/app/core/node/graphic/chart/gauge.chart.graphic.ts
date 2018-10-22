import {RegionController} from '../../region/region.controller';
import {Chart} from '../../graphic.view/chart/chart';
import {GaugeConfigComponent} from '../../../../components/graphic.config/chart/gauge.config.component';
import {session} from '../../utils/session';
import {ChartGraphic} from '@core/node/graphic/chart/chart.graphic';

export class GaugeChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }


  init(option?: any) {
    this._chart = new Chart(this);
    this._modelEventTarget.register('option', (key, oldValue, newValue) => {
      this.update(newValue);
    });
  }

}
