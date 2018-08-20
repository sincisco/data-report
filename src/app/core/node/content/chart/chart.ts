import {Type} from '@angular/core';

import {GraphicConfig} from '../../../../layout/sider/graphic.config/graphic.config';
import {ChartGraphic} from '../../graphic/chart.graphic';

enum ChartState {
  uninitialized, initialized, normal
}

// chartNode
export abstract class Chart implements IContent {
  protected _echart: Echart;
  protected _option: any = {};

  public configClass: Type<GraphicConfig>;

  private _state = ChartState.uninitialized;
  private _theme = 'roma';

  protected constructor(private _graphic: ChartGraphic) {
    // 初始化之前  确保host已经挂载到document中
    const element = document.createElement('div');
    element.style.width = '100%';
    element.style.height = '100%';
    _graphic.childHost().append(element);
    this._echart = echarts.init(element);
    this._state = ChartState.initialized;
  }

  init(option: any) {
    if (this._state === ChartState.initialized) {
      try {
        this._echart.setOption(option);
        this._option = option;
        this._state = ChartState.normal;
      } catch (e) {
        console.log(e);
        try {
          this._echart.dispose();
        } catch (e1) {
          console.log(e1);
        } finally {
          this._echart = null;
          this._graphic.childHost().empty();

          const element = document.createElement('div');
          element.style.width = '100%';
          element.style.height = '100%';
          this._graphic.childHost().append(element);
          this._echart = echarts.init(element, this._theme);
          this._state = ChartState.initialized;
        }
      }
    }
  }

  update(option: any) {
    console.log(JSON.stringify(option));
    if (option) {
      if (this._state === ChartState.initialized) {
        this.init(option);
      } else if (this._state === ChartState.normal) {
        try {
          this._echart.setOption(option);
          this._option = option;
        } catch (e) {
          console.log(e);
          try {
            this._echart.dispose();
          } catch (e1) {
            console.log(e1);
          } finally {
            this._echart = null;
            this._graphic.childHost().empty();

            const element = document.createElement('div');
            element.style.width = '100%';
            element.style.height = '100%';
            this._graphic.childHost().append(element);
            this._echart = echarts.init(element, this._theme);
            this._state = ChartState.initialized;
          }
          this._echart.setOption(this._option);
        }
      }
    }
  }

  updateTheme(theme: string) {
    console.log(theme);
    if (this._theme !== theme && this._state === ChartState.normal) {
      this._echart.dispose();
      this._graphic.childHost().empty();
      const element = $('<div style="width: 100%;height: 100%;"></div>');
      this._graphic.childHost().append(element);
      this._echart = echarts.init(element[0], theme);
      this._echart.setOption(this._option);
    }
    this._theme = theme;
  }

  refresh() {
    if (!this._echart.isDisposed() && this._option) {
      this._echart.clear();
      this._echart.setOption(this._option);
    }
  }

  /**
   * echart 激活时不需要额外变化
   */
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
      const option = this._echart.getOption();
      delete option.timeline;
      return option;
    }
  }

  destroy() {
    if (this._echart && !this._echart.isDisposed()) {
      this._echart.dispose();
      this._echart = null;
      this._graphic.childHost().empty();
    }
  }
}
