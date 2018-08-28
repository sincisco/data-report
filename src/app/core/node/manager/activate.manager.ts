import {Region} from '../region/region';
import {ReportPage} from '../page/report/page';
import {PageModel} from '../../../components/page.config/page.model';

export class ActivateManager {
  private _activatedRegion;

  constructor(private _page: ReportPage) {

  }

  activate(region: Region) {
    region.activate();
    this._page.$element.addClass('activated');
    this._page.repaintMask(region.$element);
    this._activatedRegion = region;
  }

  deactivate() {
    if (this._activatedRegion) {
      this._activatedRegion.deactivate();
      this._page.$element.removeClass('activated');
      this._activatedRegion = null;

    }
  }

  regionResize(region: Region) {
    this._page.repaintMask(region.$element);
  }


  get regionActivated() {
    return !!this._activatedRegion;
  }

}
