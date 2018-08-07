import {ChartNode} from './chart';
import {ChartBarItem} from './interface';
import {BarConfigComponent} from '../../../layout/sider/graphic.config/chart/bar.config.component';
import * as _ from 'lodash';
import {Title} from './echart.interface/title';
import {Axis} from './echart.interface/axis';

export interface ChartBarOption {
  title?: Title;
  dataset?: any;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<ChartBarItem>;
}

const defaultOption: ChartBarOption = {
  title: {
    text: '我是标题'
  },
  xAxis: {
    type: 'category'
  },
  yAxis: {
    type: 'value'
  },
  series: []
};


export class ChartBarNode extends ChartNode {


  _dataConfigClass = BarConfigComponent;

  constructor(host: HTMLElement) {
    super(host);
  }

  init(option?: any) {
    option = _.defaultsDeep(option || {}, defaultOption);
    super.init(option);
  }

}
