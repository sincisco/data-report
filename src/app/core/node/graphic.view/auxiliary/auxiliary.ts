import {ViewEventTarget} from '@core/node/event/view.event';
import {IGraphicView} from '@core/node/graphic.view/graphic.view';

export abstract class Auxiliary implements IGraphicView {
  protected _event: ViewEventTarget = new ViewEventTarget();

  abstract init(option: any);

  abstract update(option: any);

  updateTheme() {
  }

  refresh() {
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

  abstract destroy();
}
