import {Region} from '../region/region';
import {ReportPage} from '../page/report/report.page';
import {PageModel} from '../../../components/page.config/page.model';

export class RegionManager {
  private _children: Array<Region> = [];
  private _activatedRegion;

  constructor(private _page: ReportPage) {

  }

  addRegion(region: Region) {
    this._children.push(region);
  }

  deleteRegion(region: Region) {
    if (this._children.includes(region)) {
      this._children.splice(this._children.indexOf(region), 1);
    }
  }

  activate(region: Region) {
    this._activatedRegion = region;
    region.activate();
    this._page.$element.addClass('activated');
    this._page.maskRepaint(region.$element);
  }

  deactivate() {
    if (this._activatedRegion) {
      this._activatedRegion.deactivate();
      this._activatedRegion = null;
      this._page.$element.removeClass('activated');
    }
  }

  regionResize(region: Region) {
    this._page.maskRepaint(region.$element);
  }

  public selectByBox(left, top, width, height): Array<Region> {
    return this._children.filter((value: Region) => {
      const $element = value.$element, offset = $element.offset(), width1 = $element.outerWidth(), height1 = $element.outerHeight();
      return this._judge(left, top, left + width, top + height, offset.left, offset.top, offset.left + width1, offset.top + height1);
    });
  }

  private _judge(x1, y1, x2, y2, x3, y3, x4, y4) {
    if (x3 > x1 && y3 > y1 && x2 > x4 && y2 > y4) {
      return true;
    }
    return false;
  }

  get regionActivated() {
    return !!this._activatedRegion;
  }

  public initForModelUpdate(model: PageModel) {
    model.register('themeMode', (key, oldValue, newValue) => {
      this._children.forEach((item) => {
        item.updateTheme(newValue);
      });
    });
  }

}
