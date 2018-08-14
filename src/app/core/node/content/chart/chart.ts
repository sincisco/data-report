import {Type} from '@angular/core';

import {GraphicConfig} from '../../../../layout/sider/graphic.config/graphic.config';
import {ChartGraphic} from '../../graphic/chart.graphic';

// chartNode

export abstract class Chart implements IContent {
  protected _echart: Echart;

  public configClass: Type<GraphicConfig>;

  protected constructor(private _graphic: ChartGraphic) {
    // 初始化之前  确保host已经挂载到document中
    this._echart = echarts.init(_graphic.childHost()[0]);
  }

  init(option: any) {
    if (this._echart) {
      this._echart.setOption(option);
    }
  }

  update(option: any) {
    console.log(JSON.stringify(option));
    if (!this._echart.isDisposed()) {
      this._echart.setOption(option);
    }
  }

  activate() {

  }

  resize() {
    if (this._echart) {
      this._echart.resize();
    }
  }

  /**
   * 获取当前实例中维护的option对象，
   * 返回的option对象中包含了用户多次setOption合并得到的配置项和数据，
   * 也记录了用户交互的状态，例如图例的开关，数据区域缩放选择的范围等等。
   * 所以从这份 option 可以恢复或者得到一个新的一模一样的实例。
   * @returns {any}
   */
  getOption() {
    if (this._echart) {
      return this._echart.getOption();
    } else {
      return null;
    }
  }

  destroy() {
    if (this._echart && !this._echart.isDisposed()) {
      this._echart.dispose();
    }
  }
}
