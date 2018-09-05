import {closestNum} from '../../../utils/common';
import {Dimensions} from '@core/node/interface';

export enum RegionState {
  default, selected, multiSelected, activated
}

export interface IRegionModel {
  zIndex: number;
  coordinates: JQuery.Coordinates;
  dimensions: Dimensions;

  [key: string]: any;
}

export class RegionModel implements IRegionModel {
  protected _zIndex: number;
  protected _coordinates: JQuery.Coordinates;
  protected _dimensions: Dimensions;
  // 非持久化状态层
  protected _state: RegionState;

  constructor(left: number = 100, top: number = 100, width: number = 300, height: number = 200) {
    this._coordinates = {
      left,
      top
    };
    this._dimensions = {
      width,
      height
    };
    this._state = RegionState.default;
  }

  get zIndex(): number {
    return this._zIndex;
  }

  get coordinates(): JQuery.Coordinates {
    return Object.assign({}, this._coordinates);
  }

  get dimensions(): Dimensions {
    return Object.assign({}, this._dimensions);
  }

  set left(param: number) {
    this._coordinates.left = closestNum(param);
  }

  set top(param: number) {
    this._coordinates.top = closestNum(param);
  }

  get left(): number {
    return this._coordinates.left;
  }

  get top(): number {
    return this._coordinates.top;
  }

  set width(width: number) {
    this._dimensions.width = closestNum(width);
  }

  set height(height: number) {
    this._dimensions.height = closestNum(height);
  }

  get width() {
    return this._dimensions.width;
  }

  get height() {
    return this._dimensions.height;
  }

  setCoordinates(left: number, top: number) {
    this._coordinates.left = left;
    this._coordinates.top = top;
  }

  setDimensions(width: number, height: number) {
    this.width = width;
    this.height = height;
    // this.refresh();
  }

  set state(param: RegionState) {
    this._state = param;
  }

  get state(): RegionState {
    return this._state;
  }

  zoom(width: number, height: number, preserveAspectRatio?: boolean) {
    if (preserveAspectRatio) {
      height = (this.height * width) / this.width;
      this.setDimensions(width, height);
    } else {
      this.setDimensions(width, height);
    }
  }

  importModel(option: any) {
    const {zIndex, coordinates, dimensions} = option;
    if (zIndex) {
      this._zIndex = zIndex;
    }
    if (coordinates) {
      this._coordinates = coordinates;
    }
    if (dimensions) {
      this._dimensions = dimensions;
    }
  }

  exportModel() {
    return {
      zIndex: this._zIndex,
      coordinates: this.coordinates,
      dimensions: this.dimensions
    };
  }
}
