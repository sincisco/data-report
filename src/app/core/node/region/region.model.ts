import {EventEmitter, KeyValueDiffer} from '@angular/core';
import {closestNum} from '../../../utils/common';
import {Dimensions} from '@core/node/interface';
import {session} from '@core/node/utils/session';
import {debounceTime} from 'rxjs/operators';
import {ModelEventTarget} from '@core/node/event/model.event';


export enum RegionState {
  default, selected, multiSelected, activated
}

interface RegionOption {
  zIndex: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface IRegionModel {
  zIndex: number;
  coordinates: JQuery.Coordinates;
  dimensions: Dimensions;

  [key: string]: any;
}

export class RegionModel extends ModelEventTarget implements IRegionModel {
  protected option: RegionOption;
  // 非持久化状态层
  protected _state: RegionState;

  private _eventEmitter: EventEmitter<string>;
  private _differ: KeyValueDiffer<any, any>;

  constructor(left: number = 100, top: number = 100, width: number = 300, height: number = 200) {
    super();
    this.option = {
      zIndex: 1,
      left,
      top,
      width,
      height
    };

    this._state = RegionState.default;

    this._eventEmitter = new EventEmitter<string>();
    this._differ = session.differs.find(this).create();

    this._eventEmitter.pipe(debounceTime(50)).subscribe((value) => {
      const changes = this._differ.diff(this.option), array = [];
      if (changes) {
        changes.forEachRemovedItem((record) => {
          console.log('removedItem', JSON.stringify(record.key));
          array.push({
            key: `remove.${record.key}`,
            oldValue: record.previousValue,
            newValue: record.currentValue,
            option: value
          });
        });
        changes.forEachAddedItem((record) => {
          array.push({
            key: `add.${record.key}`,
            oldValue: record.previousValue,
            newValue: record.currentValue,
            option: value
          });
          console.log('addedItem', JSON.stringify(record.key));
        });
        changes.forEachChangedItem((record) => {
          console.log('changedItem', JSON.stringify(record.key));
          array.push({
            key: record.key,
            oldValue: record.previousValue,
            newValue: record.currentValue,
            option: value
          });
        });
        array.forEach((item) => {
          this.trigger(item);
        });
      }
    });
  }

  get zIndex(): number {
    return this.option.zIndex;
  }

  get coordinates(): JQuery.Coordinates {
    const {left, top} = this.option;
    return {left, top};
  }

  get dimensions(): Dimensions {
    const {width, height} = this.option;
    return {width, height};
  }

  set left(param: number) {
    this.option.left = closestNum(param);
  }

  set top(param: number) {
    this.option.top = closestNum(param);
  }

  get left(): number {
    return this.option.left;
  }

  get top(): number {
    return this.option.top;
  }

  set width(width: number) {
    this.option.width = closestNum(width);
  }

  set height(height: number) {
    this.option.height = closestNum(height);
  }

  get width() {
    return this.option.width;
  }

  get height() {
    return this.option.height;
  }

  setCoordinates(left: number, top: number) {
    this.option.left = left;
    this.option.top = top;
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
    this.option = option;
  }

  exportModel() {
    return Object.assign({}, this.option);
  }

  private digest() {
    const changes = this._differ.diff(this);
  }
}
