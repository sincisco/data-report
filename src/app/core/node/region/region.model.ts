import {KeyValueDiffer} from '@angular/core';
import {closestNum} from '../../../utils/common';
import {Dimensions} from '@core/node/interface';
import {session} from '@core/node/utils/session';
import {debounceTime} from 'rxjs/operators';
import {ModelEventTarget} from '@core/node/event/model.event';
import * as _ from 'lodash';
import {Subject} from 'rxjs';

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

// export interface IRegionModel extends IModelEventTarget {
//   zIndex: number;
//   coordinates: JQuery.Coordinates;
//   dimensions: Dimensions;
//
//   [key: string]: any;
// }


/**
 * 首先，$scope本身是一个普通的JavaScript对象；其次，$scope是一个表达式的执行环境
 * $scope是一个树形结构，与DOM标签平行，子$scope对象可以对父$scope对象的变量、函数等进行操作。
 *
 * 作用域能做什么
 提供观察者以监视数据模型的变化
 可以将数据模型的变化通知给整个应用,甚至是系统外的组件
 可以进行嵌套,隔离业务功能和数据
 给表达式提供运算时所需的执行环境
 */
export class RegionModel extends ModelEventTarget {
  protected _option: RegionOption;
  // 非持久化状态层
  private _state: RegionState;

  private _subject = new Subject();
  private _differ: KeyValueDiffer<any, any>;

  constructor(
    left: number = 100,
    top: number = 100,
    width: number = 300,
    height: number = 200) {
    super();
    this._option = {
      zIndex: 1,
      left,
      top,
      width,
      height
    };
    this._state = RegionState.default;

    this._differ = session.differs.find(this).create();

    // 避免出现添加项
    this._differ.diff(this._option);
    this._subject.pipe(debounceTime(30)).subscribe((value) => {
      const changes = this._differ.diff(this._option), array = [];
      if (changes) {
        changes.forEachRemovedItem((record) => {
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
        });
        changes.forEachChangedItem((record) => {
          array.push({
            key: record.key,
            oldValue: record.previousValue,
            newValue: record.currentValue,
            option: value
          });
        });
        this._batchTrigger(array);
      }
    });
  }

  get zIndex(): number {
    return this._option.zIndex;
  }

  get coordinates(): JQuery.Coordinates {
    return _.pick(this._option, ['left', 'top']);
  }

  get dimensions(): Dimensions {
    return _.pick(this._option, ['width', 'height']);
  }

  get left(): number {
    return this._option.left;
  }

  get top(): number {
    return this._option.top;
  }

  get width() {
    return this._option.width;
  }

  get height() {
    return this._option.height;
  }

  get state(): RegionState {
    return this._state;
  }

  set left(param: number) {
    this._option.left = closestNum(param);
  }

  set top(param: number) {
    this._option.top = closestNum(param);
  }

  set width(width: number) {
    this._option.width = closestNum(width);
  }

  set height(height: number) {
    this._option.height = closestNum(height);
  }

  set state(param: RegionState) {
    if (this._state !== param) {
      const changedItem = {key: 'state', oldValue: this._state, newValue: param, option: null};
      this._state = param;
      this._trigger(changedItem);
    }
  }

  setCoordinates(left: number, top: number) {
    this.left = left;
    this.top = top;
  }

  setDimensions(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  zoom(width: number, height: number, preserveAspectRatio?: boolean) {
    if (preserveAspectRatio) {
      height = (this.height * width) / this.width;
      this.setDimensions(width, height);
    } else {
      this.setDimensions(width, height);
    }
  }

  /**
   * 不可以直接将option赋值给model对象
   * 因为多次粘贴的情况 会导致多个region公用一个model对象
   * @param option
   */
  importModel(option: any) {
    this._option = Object.assign({}, option);
  }

  exportModel() {
    return Object.assign({}, this._option);
  }

  destroy() {
  }
}
