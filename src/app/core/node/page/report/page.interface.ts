import {RegionController} from '@core/node/region/region.controller';

/**
 *
 */
export interface IReportPage {
  /**
   * region根据scale计算位移和伸缩
   */
  scale: number;
  selectedArray: Array<RegionController>;

  addChild(region: RegionController);

  removeChild(region: RegionController);

  select(region: RegionController);

  ctrlSelect(region: RegionController);

  isSelected(region: RegionController): boolean;

  activateRegion(region: RegionController);

  regionResize(region: RegionController);

  getMockConfigSource(option: any);

  getConfigSource(option: any);

  getDataSource(id: string);
}
