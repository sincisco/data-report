import {IGraphic} from '../graphic/graphic';
import {ReportPageInner} from '@core/node/page/report/page.inner';
import {RegionModel, RegionState} from '@core/node/region/region.model';
import {RegionView} from '@core/node/region/region.view';
import {GraphicWrapper} from '@core/node/graphic/graphic.wrapper';
import {IReportPage} from '@core/node/page/report/page.interface';


export abstract class RegionController {

  // 模型层
  protected _page: IReportPage;
  protected _model: RegionModel;
  protected _view: RegionView;
  protected _graphicWrapper: GraphicWrapper;

  private _methodMap: Map<string, Function> = new Map();

  get $element() {
    return this._view.$element;
  }

  set state(param: RegionState) {
    this._model.state = param;
  }

  get state() {
    return this._model.state;
  }

  get page(): IReportPage {
    return this._page;
  }

  get graphicWrapper(): GraphicWrapper {
    return this._graphicWrapper;
  }

  init(regionOption: any) {

  }

  addMethod(name: string, method: Function) {
    this._methodMap.set(name, method);
  }

  invoke(...args: Array<any>) {
    const name = args.shift();
    if (this._methodMap.has(name)) {
      return this._methodMap.get(name)(...args);
    }
  }

  /**
   * 模型层关联，展现层关联
   * @param {IGraphic} graphic
   */
  addChild(graphic: GraphicWrapper) {
    this._graphicWrapper = graphic;
    this._view.$fill.append(graphic.$element);
  }

  updateTheme(theme: string) {
    if (this._graphicWrapper) {
      this._graphicWrapper.updateTheme(theme);
    }
  }

  setCoordinates(left, top) {
    this._model.setCoordinates(left, top);
    this._view.refresh();
  }

  setDimensions(width: number, height: number) {
    this._model.setDimensions(width, height);
    this._view.refresh();
    this._graphicWrapper && this._graphicWrapper.resize();
  }

  abstract getOption();

  get scale() {
    return this._page.scale;
  }

  regionResize() {
    this._page.regionResize(this);
  }

  /**
   * 1、销毁内部对象
   * 2、解除事件绑定
   * 3、解除当前对象的属性引用
   */
  destroy() {
    if (this._graphicWrapper) {
      this._graphicWrapper.destroy();
      this._graphicWrapper = null;
    }
    this._page.removeChild(this);
    this._page = null;

    this._methodMap.clear();

    this._view.destroy();
  }
}

