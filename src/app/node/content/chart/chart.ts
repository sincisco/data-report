import {ComponentRef, Type} from '@angular/core';

import {IDataComponent} from '../../../layout/sider/property.data/html/header.component';
import {siderLeftComponent} from '../../../layout/sider/sider.left.component';

export abstract class ChartNode implements IContent {
  private _echart: Echart;
  protected _dataConfigClass: Type<IDataComponent>;
  protected _dataConfigComponentRef: ComponentRef<IDataComponent>;

  protected constructor(public host: HTMLElement) {
    // 初始化之前  确保host已经挂载到document中
    this._echart = echarts.init(host);
  }

  init(option: any) {
    this._echart.setOption(option);
  }

  update(option: any) {
    this._echart.setOption(option);
  }

  activate() {
    if (!this._dataConfigComponentRef) {
      this._dataConfigComponentRef = siderLeftComponent.createDataProperty(this._dataConfigClass);
    } else {
      siderLeftComponent.attachDataProperty(this._dataConfigComponentRef.hostView);
    }
  }

  resize() {
    this._echart.resize();
  }

  /**
   * 获取当前实例中维护的option对象，
   * 返回的option对象中包含了用户多次setOption合并得到的配置项和数据，
   * 也记录了用户交互的状态，例如图例的开关，数据区域缩放选择的范围等等。
   * 所以从这份 option 可以恢复或者得到一个新的一模一样的实例。
   * @returns {any}
   */
  getOption() {
    return this._echart.getOption();
  }
}
