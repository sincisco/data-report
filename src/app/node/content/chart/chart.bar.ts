import {ChartNode} from './chart';
import {BarConfigComponent} from '../../../layout/sider/graphic.config/chart/bar.config.component';
import * as _ from 'lodash';
import {Title} from './echart.interface/title';
import {Axis} from './echart.interface/axis';
import {Grid} from './echart.interface/grid';
import {BarSeriesConfig} from './echart.interface/series/bar.series';

export interface ChartBarOption {
  title?: Title;
  dataset?: any;
  grid?: Grid;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<BarSeriesConfig>;
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
