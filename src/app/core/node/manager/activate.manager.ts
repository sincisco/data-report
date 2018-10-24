import {RegionController} from '../region/region.controller';
import {ReportPage} from '../page/report/page';
import {RegionState} from '@core/node/region/region.model';

export class ActivateManager {
  private _activatedRegion: RegionController;

  constructor(private _page: ReportPage) {

  }

  activate(region: RegionController) {
    region.state = RegionState.activated;
    this._page.view.$element.addClass('activated');
    this._page.view.repaintMask(region.$element);
    this._activatedRegion = region;
  }

  deactivate() {
    if (this._activatedRegion) {
      this._activatedRegion.state = RegionState.default;
      this._page.view.$element.removeClass('activated');
      this._activatedRegion = null;

    }
  }

  regionResize(region: RegionController) {
    this._page.view.repaintMask(region.$element);
  }


  get regionActivated() {
    return !!this._activatedRegion;
  }

  destroy() {
    this._page = null;
  }

}
