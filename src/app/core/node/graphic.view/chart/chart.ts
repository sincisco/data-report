import {ChartGraphic} from '../../graphic/chart/chart.graphic';
import {ViewEventTarget} from '@core/node/event/view.event';
import {IGraphicView} from '@core/node/graphic.view/graphic.view';
import {DefaultGraphicView} from '@core/node/graphic.view/default.graphic.view';

enum ChartState {
  uninitialized, initialized, normal, destroyed
}

// chartNode
export class Chart extends DefaultGraphicView implements IGraphicView {
  $element: JQuery;
  protected _echart: Echart;

  private _theme = 'vintage';
  protected _option: any = {};
  private _state = ChartState.uninitialized;

  constructor(private _graphic: ChartGraphic) {
    super();
    this.$element = $('<div style="width: 100%;height: 100%;"></div>');

    // 初始化之前  确保host已经挂载到document中
    this._innerReInit();
  }

  /**
   * update和init的区别
   * 在发生异常的时候 update需要回滚到上一个正常状态，而init不需要
   * @param option
   */
  update(option: any) {
    if (option) {
      if (this._state === ChartState.initialized) {
        try {
          this._echart.setOption(option);
          this._option = option;
          this._state = ChartState.normal;
        } catch (e) {
          console.log(e);

          this._innerReInit();
        }
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

  updateData(data: any) {
    if (data) {
      if (this._state === ChartState.normal) {
        try {
          this._echart.setOption({dataset: data});
          this._option = Object.assign(this._option, {dataset: data});
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
    if (this._theme !== theme && !!theme) {
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
      // this._echart.setOption(this.getOption());
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
   * 什么情况下需要恢复到初始化状态
   * 1、echart主题发生变化
   * 2、更新echart出现异常的时候
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
