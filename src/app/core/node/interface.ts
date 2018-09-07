import {RegionController} from '@core/node/region/region.controller';

export interface IPage {
  addChild(region: RegionController);

  destroy();
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface CoordinatesAndDimensions {
  left: number;
  top: number;
  width: number;
  height: number;
}
