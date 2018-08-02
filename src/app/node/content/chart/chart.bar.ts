import {ChartNode} from './chart';
import {ChartBarItem, IAxis, ITitle} from './interface';
import {siderLeftComponent} from '../../../layout/sider/sider.left.component';
import {DataBarComponent} from '../../../layout/sider/property.data/chart/data.bar.component';
import {ComponentRef} from '@angular/core';
import {IDataComponent} from '../../../layout/sider/property.data/html/header.component';
import * as _ from 'lodash';

export interface ChartBarOption {
  title?: ITitle;
  dataset?: any;
  xAxis?: IAxis;
  yAxis?: IAxis;
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


  _dataConfigClass = DataBarComponent;

  constructor(host: HTMLElement) {
    super(host);
  }

  init(option?: any) {
    option = _.defaultsDeep(option || {}, defaultOption);
    super.init(option);
  }

}
