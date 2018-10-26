import {IGraphic} from './graphic';
import {IGraphicView} from '../graphic.view/graphic.view';
import {Observable, Subscription} from 'rxjs';
import {OuterModelEventTarget} from '@core/node/event/model.event';

export abstract class DefaultGraphic implements IGraphic {
  $element: JQuery;

  protected _view: IGraphicView;
  protected _modelEventTarget = new OuterModelEventTarget();

  /**
   * 一般用于初始化  新建Graphic的时候调用
   * 如果有content的，则创建相应的content；负责配置面板的创建
   * @param option
   */
  abstract init(...params: Array<any>);

  abstract accept(model: Observable<any>): Subscription;

  /**
   * 更新全局样式 目前只有Echart图表使用的到
   * @param {string} theme
   */
  updateTheme(theme: string) {
  }


  resize() {
    if (this._view) {
      this._view.resize();
    }
  }

  activate() {
    if (this._view) {
      this._view.activate();
    }
  }

  deactivate() {
    if (this._view) {
      this._view.deactivate();
    }
  }

  destroy() {
    this._modelEventTarget.destroy();

    if (this._view) {
      this._view.destroy();
      this._view = null;
    }
    this.$element.remove();
    this.$element = null;
  }
}

