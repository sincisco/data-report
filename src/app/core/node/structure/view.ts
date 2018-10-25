import {ViewEventTarget} from '@core/node/event/view.event';


export abstract class View {
  $element: JQuery;

  protected _eventTarget = new ViewEventTarget();

  addEventListener(eventName: string, callback: Function) {
    this._eventTarget.addEventListener(eventName, callback);
    return this;
  }

  removeEventListener(eventName: string, fn?: Function) {
    this._eventTarget.removeEventListener(eventName, fn);
    return this;
  }

  /**
   * 1、销毁内部对象
   * 2、解除事件绑定
   * 3、解除当前对象的属性引用
   */
  destroy() {
    if (this._eventTarget) {
      this._eventTarget.destroy();
      this._eventTarget = null;
    }
  }
}
