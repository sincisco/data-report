import {Type} from '@angular/core';

import * as _ from 'lodash';
import {DesignGraphicConfig} from '../../source/config.source/design.config.source';

export abstract class EchartFace {
  protected _echart: Echart;

  public configClass: Type<DesignGraphicConfig>;

  protected constructor(private _host: HTMLElement) {
    // 初始化之前  确保host已经挂载到document中
    this._echart = echarts.init(_host);
  }

  init(option: any) {
    if (this._echart) {
      option = Object.assign(option, {
        xAxis: {
          axisLabel: {
            color: '#fdfdfd'
          }
        },
        textStyle: {
          color: '#fdfdfd'
        }
      });
      this._echart.setOption(option);
    }
  }

  update(option: any) {
    if (!this._echart.isDisposed()) {
      option = _.defaultsDeep(option, {
        grid: {
          left: 10,
          right: 10,
          top: 30,
          bottom: 30
        },
        xAxis: {
          axisLabel: {
            color: '#fdfdfd'
          }
        },
        textStyle: {
          color: '#fdfdfd'
        }
      });
      this._echart.setOption(option);
    }
  }

  refresh() {

  }

  activate() {

  }

  select() {

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

  render() {
    return `
        <echart-wrapper pid="${'07ecb2ce-0a77-4759-8b1a-e46ee9360907'}"></echart-wrapper>
        `;
  }
}
