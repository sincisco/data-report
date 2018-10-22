import {RegionController} from '../../region/region.controller';
import {LineConfigComponent} from '../../../../components/graphic.config/chart/line.config.component';
import {session} from '../../utils/session';
import {ChartGraphic} from '@core/node/graphic/chart/chart.graphic';


export class LinesChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }

  init(option?: any) {
    // this._chart = new LinesChart(this);
    this._configComponentRef = session.siderLeftComponent.forwardCreateGraphicConfig(LineConfigComponent);
    if (option) {
      this.configSource.importOption(option);
    }
  }

}
