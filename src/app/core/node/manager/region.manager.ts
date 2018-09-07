import {RegionController} from '../region/region.controller';
import {ReportPage} from '../page/report/page';
import {PageModel} from '../../../components/page.config/page.model';

export class RegionManager {
  private _children: Array<RegionController> = [];

  constructor() {

  }

  add(region: RegionController) {
    this._children.push(region);
  }

  remove(region: RegionController) {
    if (this._children.includes(region)) {
      this._children.splice(this._children.indexOf(region), 1);
    }
  }

  get regionArray() {
    return this._children.slice(0);
  }

  public selectByBox(left, top, width, height): Array<RegionController> {
    return this._children.filter((value: RegionController) => {
      const $element = value.$element,
        offset = $element.offset(),
        x1 = left, y1 = top,
        x2 = left + width, y2 = top + height,
        x3 = offset.left, y3 = offset.top,
        x4 = offset.left + $element.outerWidth(), y4 = offset.top + $element.outerHeight();
      return (x3 > x1 && y3 > y1 && x2 > x4 && y2 > y4);
    });
  }

  public listenToModel(model: PageModel) {
    model.register('themeMode', (key, oldValue, newValue) => {
      this._children.forEach((item) => {
        item.updateTheme(newValue);
      });
    });
  }

  save() {
    return JSON.stringify(this._children.map((item) => {
      return item.derender();
    }), null, 2);
  }

}
