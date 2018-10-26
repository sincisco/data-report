import {ReportPageInner} from '@core/node/page/report/page.inner';
import {IReportPage} from '@core/node/page/report/page.interface';
import {RegionController} from '@core/node/region/region.controller';
import {Observable} from 'rxjs';


export class ReportPage implements IReportPage {

  focusRegion: RegionController;

  constructor(private _pageInner: ReportPageInner) {

  }

  set scale(value: number) {
    this._pageInner.view.scale = value;
  }

  get scale(): number {
    return this._pageInner.view.scale;
  }

  get regionArray(): Array<RegionController> {
    return this._pageInner.regionManager.regionArray;
  }

  get regionArrayAsObservable(): Observable<Array<RegionController>> {
    return this._pageInner.regionManager.regionArrayAsObservable;
  }

  get selectedArray(): Array<RegionController> {
    return this._pageInner.selectManager.selectedArray;
  }


  addChild(child: RegionController) {
    // child.page = this;
    this._pageInner.regionManager.add(child);
    this._pageInner.view.$grid.append(child.$element);
  }

  removeChild(child: RegionController) {
    this._pageInner.selectManager.delete(child);
    this._pageInner.regionManager.remove(child);
  }

  select(region: RegionController) {
    this._pageInner.selectManager.select(region);
  }

  ctrlSelect(region: RegionController) {
    this._pageInner.selectManager.ctrlSelect(region);
  }

  isSelected(region: RegionController) {
    return this._pageInner.selectManager.include(region);
  }

  activateRegion(region: RegionController) {
    this._pageInner.activateManager.activate(region);
  }

  regionResize(region: RegionController) {
    this._pageInner.activateManager.regionResize(region);
  }

  getMockConfigSource(option: any) {
    return this._pageInner.configSourceManager.getMockConfigSource(option);
  }

  getConfigSource(option: any) {
    return this._pageInner.configSourceManager.getConfigSource(option);
  }

  getDataSource(id: string) {
    return this._pageInner.dataSourceManager.getDataSourceByID(id);
  }

  destroy() {
    this._pageInner = null;
  }
}
