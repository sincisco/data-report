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

  $element: JQuery;

  // 模型层
  protected _page: ReportPage;
  protected _model: RegionModel;
  protected _view: RegionView;
  protected _graphic: IGraphic;

  get state() {
    return this._model.state;
  }

  set state(param: RegionState) {
    this._model.state = param;
  }

  abstract updateTheme(theme: string);

  abstract activate();

  abstract deactivate();

  abstract addChild(graphic: IGraphic);

  setCoordinates(x, y) {
  }

  setDimensions(width: number, height: number) {
  }

  abstract derender();

  get scale() {
    return this._page.scale;
  }

  regionResize() {
    this._page.regionResize(this);
  }
}

