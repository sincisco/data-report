import {Region} from '../region/region';
import {ReportPage} from '../page/report/report.page';
import {PageModel} from '../../../components/page.config/page.model';

export class RegionManager {
  private _children: Array<Region> = [];

  constructor() {

  }

  add(region: Region) {
    this._children.push(region);
  }

  remove(region: Region) {
    if (this._children.includes(region)) {
      this._children.splice(this._children.indexOf(region), 1);
    }
  }

  get regionArray() {
    return this._children.slice(0);
  }

  public selectByBox(left, top, width, height): Array<Region> {
    return this._children.filter((value: Region) => {
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

}
