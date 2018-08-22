import {Type} from '@angular/core/src/type';

import {Region} from '../region/region';
import {ChartGraphic} from '@core/node/graphic/chart.graphic';
import {ConfigModel} from '../../../layout/sider/graphic.config/graphic.config';

export class BarChartGraphic extends ChartGraphic {
  configClass: Type<ConfigModel>;

  constructor(region: Region) {
    super(region);
  }
}
