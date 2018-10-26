import {ViewEventTarget} from '@core/node/event/view.event';
import {IGraphicView} from '@core/node/graphic.view/graphic.view';

export abstract class DefaultGraphicView implements IGraphicView {
  $element: JQuery;

  protected _event: ViewEventTarget = new ViewEventTarget();

  abstract update(option: any);

  updateConfig(config: any) {

  }

  updateData(data: any) {

  }

  updateTheme(theme: string) {
  }

  resize() {
  }

  activate() {
  }

  deactivate() {
  }

  addEventListener(eventName: string, callback: Function) {
    this._event.addEventListener(eventName, callback);
    return this;
  }

  removeEventListener(eventName: string, fn?: Function) {
    this._event.removeEventListener(eventName, fn);
    return this;
  }

  destroy() {
    if (this._event) {
      this._event.destroy();
      this._event = null;
    }
  }
}
