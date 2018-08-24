import {EchartFace} from '@core/node/face/echart.face';
import {BarConfigComponent} from '../../../components/graphic.config/chart/bar.config.component';

export class BarEchartFace extends EchartFace {


  configClass = BarConfigComponent;

  constructor(host: HTMLElement) {
    super(host);
  }

  destroy() {
    delete this.configClass;
    super.destroy();
  }

}
