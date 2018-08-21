import {Type} from '@angular/core';

import {GraphicConfig} from '../../../../layout/sider/graphic.config/graphic.config';
import {ChartGraphic} from '../../graphic/chart.graphic';

enum ChartState {
  uninitialized, initialized, normal, destroyed
}

// chartNode
export abstract class Chart implements IContent {
  protected _echart: Echart;
  private _theme = 'roma';
  protected _option: any = {};
  private _state = ChartState.uninitialized;

  public configClass: Type<GraphicConfig>;

  protected constructor(private _graphic: ChartGraphic) {
    // 初始化之前  确保host已经挂载到document中
    this._innerReInit();
  }

  init(option: any) {
    if (this._state === ChartState.initialized) {
      try {
        this._echart.setOption(option);
        this._option = option;
        this._state = ChartState.normal;
      } catch (e) {
        console.log(e);

        this._innerReInit();
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

          this._innerReInit();

          this._echart.setOption(this._option);
          this._state = ChartState.normal;
        }
      }
    }
  }

  updateTheme(theme: string) {
    console.log(theme);
    if (this._theme !== theme) {
      this._theme = theme;
      this._innerReInit();
      if (this._option) {
        this._echart.setOption(this._option);
        this._state = ChartState.normal;
      }
    }
  }

  refresh() {
    if (!this._echart.isDisposed() && this._option) {
      this._echart.clear();
      this._echart.setOption(this.getOption());
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
    }
    this._graphic.childHost().empty();
    delete this._option;
    delete this._graphic;

    this._state = ChartState.destroyed;
  }

  private _innerReInit() {
    if (this._echart && !this._echart.isDisposed()) {
      this._echart.dispose();
      this._echart = null;
    }
    this._graphic.childHost().empty();

    const element = document.createElement('div');
    element.style.width = '100%';
    element.style.height = '100%';
    this._graphic.childHost().append(element);
    if (this._theme) {
      this._echart = echarts.init(element, this._theme);
    } else {
      this._echart = echarts.init(element);
    }

    this._state = ChartState.initialized;
  }
}
