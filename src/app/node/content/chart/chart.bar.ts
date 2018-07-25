import {ChartNode} from './chart';
import {ChartBarItem, IAxis, ITitle} from './interface';
import {siderLeftComponent} from '../../../layout/sider/sider.left.component';
import {DataBarComponent} from '../../../layout/sider/property.data/chart/data.bar.component';
import {ComponentRef} from '@angular/core';
import {IDataComponent} from '../../../layout/sider/property.data/html/header.component';

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
  xAxis: {},
  yAxis: {
    type: 'value'
  },
  series: []
};


export class ChartBarNode extends ChartNode {


  dataProperty = DataBarComponent;

  private _dataPropertyComponentRef: ComponentRef<IDataComponent>;

  constructor(host: HTMLElement) {
    super(host);
  }

  activate() {
    if (!this._dataPropertyComponentRef) {
      this._dataPropertyComponentRef = siderLeftComponent.createDataProperty(this.dataProperty);
    } else {
      siderLeftComponent.attachDataProperty(this._dataPropertyComponentRef.hostView);
    }

  }

}
