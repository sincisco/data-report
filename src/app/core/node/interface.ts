import {Region} from '@core/node/region/region';

export interface IPage {
  addChild(region: Region);

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
