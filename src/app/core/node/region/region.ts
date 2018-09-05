import {IGraphic} from '../graphic/graphic';
import {ReportPage} from '@core/node/page/report/page';


export const reportGlobal: {
  instance: IGraphic
} = {
  instance: null
};

export abstract class Region {

  $element: JQuery;

  protected _page: ReportPage;

  abstract updateTheme(theme: string);

  abstract select();

  abstract unselect();

  abstract multiSelect();

  abstract multiUnselect();

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

