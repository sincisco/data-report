import {ChartNode} from './chart';
import {ChartBarItem, IAxis, ITitle} from "./interface";
import {siderLeftComponent} from "../../../layout/sider/sider.left.component";
import {DataBarComponent} from "../../../layout/sider/property.data/chart/data.bar.component";

interface ChartBarOption {
  title?: ITitle;
  xAxis: IAxis;
  yAxis: IAxis;
  series: Array<ChartBarItem>;
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

  constructor(host: HTMLElement) {
    super(host);
  }

  activate() {
    siderLeftComponent.createDataProperty(this.dataProperty);
  }

}
