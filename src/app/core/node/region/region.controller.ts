import {IGraphic} from '../graphic/graphic';
import {ReportPage} from '@core/node/page/report/page';
import {RegionModel, RegionState} from '@core/node/region/region.model';
import {RegionView} from '@core/node/region/region.view';
import {GraphicWrapper} from '@core/node/graphic/graphic.wrapper';


export const reportGlobal: {
  instance: GraphicWrapper
} = {
  instance: null
};

export abstract class RegionController {

  // 模型层
  protected _page: ReportPage;
  protected _model: RegionModel;
  protected _view: RegionView;
  protected _graphicWrapper: GraphicWrapper;

  get $element() {
    return this._view.$element;
  }

  set state(param: RegionState) {
    this._model.state = param;
  }

  get state() {
    return this._model.state;
  }

  get page() {
    return this._page;
  }

  init(regionOption: any) {

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

    this._view.destroy();
  }
}

