import {ComponentRef, Type} from '@angular/core';

import {siderLeftComponent} from '../../../layout/sider/sider.left.component';
import {GraphicConfig} from '../../../layout/sider/graphic.config/graphic.config';

export abstract class ChartNode implements IContent {
  private _echart: Echart;
  protected _configClass: Type<GraphicConfig>;
  protected _configComponentRef: ComponentRef<GraphicConfig>;

  protected constructor(public host: HTMLElement) {
    // 初始化之前  确保host已经挂载到document中
    this._echart = echarts.init(host);
  }

  init(option: any) {
    this._echart.setOption(option);
  }

  update(option: any) {
    console.log(JSON.stringify(option));
    this._echart.setOption(option);
  }

  activate() {
    if (!this._configComponentRef) {
      this._configComponentRef = siderLeftComponent.createGraphicConfig(this._configClass);
      this._configComponentRef.instance.content = this;
    } else {
      siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
    }
  }

  protected mockActive() {
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(this._configClass);
    this._configComponentRef.instance.content = this;
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
