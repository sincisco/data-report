import {ChartNode} from './chart';
import {ChartBarItem} from './interface';
import {BarConfigComponent} from '../../../layout/sider/graphic.config/chart/bar.config.component';
import * as _ from 'lodash';
import {Title} from './echart.interface/title';
import {Axis} from './echart.interface/axis';
import {Grid} from './echart.interface/grid';

export interface ChartBarOption {
  title?: Title;
  dataset?: any;
  grid?: Grid;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<ChartBarItem>;
}


export class ChartBarNode extends ChartNode {


  _configClass = BarConfigComponent;

  constructor(host: HTMLElement) {
    super(host);
  }

  init(option?: any) {
    this.mockActive();
    option = _.defaultsDeep(option || {}, this._configComponentRef.instance.option);
    super.init(option);
  }

}
