import {IEventTarget} from '@core/node/event/event';
import {ViewEventTarget} from '@core/node/event/view.event';

export interface IView extends IEventTarget {
  $element: JQuery;

  destroy();
}

export abstract class View implements IView {
  $element: JQuery;

  protected _event = new ViewEventTarget();

  addEventListener(eventName: string, callback: Function) {
    this._event.addEventListener(eventName, callback);
    return this;
  }

  removeEventListener(eventName: string, fn?: Function) {
    this._event.removeEventListener(eventName, fn);
    return this;
  }

  /**
   * 1、销毁内部对象
   * 2、解除事件绑定
   * 3、解除当前对象的属性引用
   */
  destroy() {
    this.$element.remove();

    this._event.destroy();
    this._event = null;
  }
}
