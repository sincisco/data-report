import {IGraphic} from '../graphic/graphic';
import {ReportPage} from '@core/node/page/report/page';
import {RegionModel, RegionState} from '@core/node/region/region.model';
import {RegionView} from '@core/node/region/region.view';


export const reportGlobal: {
  instance: IGraphic
} = {
  instance: null
};

export abstract class Region {

  // 模型层
  protected _page: ReportPage;
  protected _model: RegionModel;
  protected _view: RegionView;
  protected _graphic: IGraphic;

  get $element() {
    return this._view.$element;
  }

  set state(param: RegionState) {
    this._model.state = param;
  }

  get state() {
    return this._model.state;
  }

  updateTheme(theme: string) {
    if (this._graphic) {
      this._graphic.updateTheme(theme);
    }
  }

  /**
   * 模型层关联，展现层关联
   * @param {IGraphic} graphic
   */
  addChild(graphic: IGraphic) {
    this._graphic = graphic;
    this._view.$fill.append(graphic.$element);
  }

  setCoordinates(left, top) {
    this._model.setCoordinates(left, top);
    this._view.refresh();
  }

  setDimensions(width: number, height: number) {
    this._model.setDimensions(width, height);
    this._view.refresh();
  }

  abstract derender();

  get scale() {
    return this._page.scale;
  }

  regionResize() {
    this._page.regionResize(this);
  }
}

