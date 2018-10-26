import {ViewEventTarget} from '@core/node/event/view.event';
import {IGraphicView} from '@core/node/graphic.view/graphic.view';


export abstract class HtmlNode implements IGraphicView {
  $element: JQuery;
  protected _event: ViewEventTarget = new ViewEventTarget();

  abstract resize();

  abstract init(option: any);

  abstract update(option: any);

  updateConfig(config: any) {
  }

  updateData(data) {
  }

  updateTheme(theme: string) {

  }

  refresh() {
  }

  abstract activate();

  deactivate() {
  }

  abstract destroy();

  addEventListener(eventName: string, callback: Function) {
    this._event.addEventListener(eventName, callback);
    return this;
  }

  removeEventListener(eventName: string, fn?: Function) {
    this._event.removeEventListener(eventName, fn);
    return this;
  }
}
