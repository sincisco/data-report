import {RegionController} from '../../region/region.controller';
import {Chart} from '../../graphic.view/chart/chart';
import {WordCloudConfigComponent} from '../../../../components/graphic.config/chart/word.cloud.config.component';
import {session} from '../../utils/session';
import {ChartGraphic} from '@core/node/graphic/chart/chart.graphic';

export class WordCloudChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }


  init(option?: any) {
    this._chart = new Chart(this);
    this._configComponentRef = session.siderLeftComponent.forwardCreateGraphicConfig(WordCloudConfigComponent);
    if (option) {
      this.configSource.importOption(option);
    }
    this._modelEventTarget.register('option', (key, oldValue, newValue) => {
      this.update(newValue);
    });
  }

}
