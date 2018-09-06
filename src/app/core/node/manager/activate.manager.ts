import {Region} from '../region/region';
import {ReportPage} from '../page/report/page';
import {RegionState} from '@core/node/region/region.model';

export class ActivateManager {
  private _activatedRegion: Region;

  constructor(private _page: ReportPage) {

  }

  activate(region: Region) {
    region.state = RegionState.activated;
    this._page.$element.addClass('activated');
    this._page.repaintMask(region.$element);
    this._activatedRegion = region;
  }

  deactivate() {
    if (this._activatedRegion) {
      this._activatedRegion.state = RegionState.default;
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
