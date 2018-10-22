import {RegionController} from '../../region/region.controller';
import {Chart} from '../../graphic.view/chart/chart';
import {ChartGraphic} from '@core/node/graphic/chart/chart.graphic';

export class FlipBarChartGraphic extends ChartGraphic {
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
