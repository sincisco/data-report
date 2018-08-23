import {Type} from '@angular/core';

import {ConfigModel} from '../../../../layout/sider/graphic.config/graphic.config';
import {ChartGraphic} from '../../graphic/chart.graphic/chart.graphic';

enum ChartState {
  uninitialized, initialized, normal, destroyed
}

// chartNode
export class Chart implements IContent {
  $element: JQuery;
  protected _echart: Echart;
  private _theme = 'roma';
  protected _option: any = {};
  private _state = ChartState.uninitialized;

  public configClass: Type<ConfigModel>;

  constructor(private _graphic: ChartGraphic) {
    this.$element = $('<div style="width: 100%;height: 100%;"></div>');

    _graphic.addChild(this);
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

  /**
   * update和init的区别
   * 在发生异常的时候 update需要回滚到上一个正常状态，而init不需要
   * @param option
   */
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

  /**
   * 如果Echart没有加载数据
   * @param {string} theme
   */
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
    if (this._state === ChartState.normal) {
      this._echart.clear();
      this._echart.setOption(this.getOption());
    }
  }

  /**
   * echart 激活时不需要额外变化
   */
  activate() {

  }

  deactivate() {
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

  render() {

  }

  derender() {
  }


  destroy() {
    if (this._echart && !this._echart.isDisposed()) {
      this._echart.dispose();
      this._echart = null;
    }
    this.$element.empty();
    delete this._option;
    delete this._graphic;

    this._state = ChartState.destroyed;
  }

  /**
   * 恢复到初始化状态
   * @private
   */
  private _innerReInit() {
    if (this._echart && !this._echart.isDisposed()) {
      this._echart.dispose();
      this._echart = null;
    }
    this.$element.empty();

    const element = document.createElement('div');
    element.style.width = '100%';
    element.style.height = '100%';
    this.$element.append(element);
    if (this._theme) {
      this._echart = echarts.init(element, this._theme);
    } else {
      this._echart = echarts.init(element);
    }

    this._state = ChartState.initialized;
  }
}
