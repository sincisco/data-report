import {RegionController} from '../region/region.controller';
import {RegionState} from '@core/node/region/region.model';

enum SelectStatus {
  default, single, multi
}

/**
 * 被删除的region如何剔除
 */
class Store {
  private _selected: RegionController = null;
  private _selectArray: Array<RegionController> = [];

  get status(): SelectStatus {
    switch (this._selectArray.length) {
      case 0:
        return SelectStatus.default;
      case 1:
        return SelectStatus.single;
      default:
        return SelectStatus.multi;
    }
  }

  get selectedArray() {
    return this._selectArray.slice(0);
  }

  /**
   * 判断传入元素是否包含在多选集合中
   *
   * 删除元素的时候，判断该Region是否被选中
   * 如果没有被选中 那么只删除当前region
   * 否则删除r被选中的region组
   * @param {RegionController} region
   * @returns {boolean}
   */
  include(region: RegionController) {
    return this._selectArray.includes(region);
  }

  addRegion(region: RegionController) {
    if (!this.include(region)) {
      this._selectArray.push(region);
      if (this._selectArray.length > 1) {
        this._selectArray.forEach((value) => {
          if (value.state !== RegionState.multiSelected) {
            value.state = RegionState.multiSelected;
          }
        });
      } else {
        region.state = RegionState.selected;
      }
    }
  }

  removeRegion(region: RegionController) {
    if (this._selectArray.includes(region)) {
      region.state = RegionState.default;
      this._selectArray.splice(this._selectArray.indexOf(region), 1);

      if (this._selectArray.length === 1) {
        const region1 = this._selectArray[0];
        region1.state = RegionState.selected;
      }
    }
  }

  clear() {
    while (this._selectArray.length > 0) {
      const region = this._selectArray.pop();
      region.state = RegionState.default;
    }
  }

  /**
   * 当元素从页面删除的时候 需要清空selectManager对它的引用
   * @param region
   */
  delete(region: RegionController) {
    if (this._selected === region) {
      this._selected = null;
    } else if (this.include(region)) {
      this._selectArray.splice(this._selectArray.indexOf(region), 1);
    }
  }
}

abstract class State {
  protected constructor(protected store: Store) {
  }

  abstract select(region: RegionController);

  abstract ctrlSelect(region: RegionController);
}

class StateDefault extends State {
  constructor(store) {
    super(store);
  }

  select(region: RegionController) {
    this.store.addRegion(region);
  }

  ctrlSelect(region: RegionController) {
    this.store.addRegion(region);
  }
}

class StateSelected extends State {
  constructor(store: Store) {
    super(store);
  }

  select(region: RegionController) {
    if (this.store.include(region)) {
      return;
    } else {
      this.store.clear();
      this.store.addRegion(region);
    }
  }

  ctrlSelect(region: RegionController) {
    if (this.store.include(region)) {
      this.store.removeRegion(region);
    } else {
      this.store.addRegion(region);
      // this.store.addMultiSelected(this.store.clearSelected());
      // this.store.addMultiSelected(region);
    }
  }
}

class StateMultiSelected extends State {
  constructor(store) {
    super(store);
  }

  select(region: RegionController) {
    this.store.clear();
    this.store.addRegion(region);
    // this.store.clearTotalMultiSelected();
    // this.store.addSelected(region);
  }

  ctrlSelect(region: RegionController) {
    if (this.store.include(region)) {
      this.store.removeRegion(region);
    } else {
      this.store.addRegion(region);
    }
    // if (this.store.include(region)) {
    //   this.store.removeMultiSelected(region);
    // } else {
    //   this.store.addMultiSelected(region);
    // }
  }
}

export class SelectManager extends Store implements ISelectManager {
  private readonly _stateDefault: State;
  private readonly _stateSelected: State;
  private readonly _stateMultiSelected: State;

  constructor() {
    super();
    this._stateDefault = new StateDefault(this);
    this._stateSelected = new StateSelected(this);
    this._stateMultiSelected = new StateMultiSelected(this);
  }

  private get state(): State {
    switch (this.status) {
      case SelectStatus.default:
        return this._stateDefault;
      case SelectStatus.single:
        return this._stateSelected;
      case SelectStatus.multi:
        return this._stateMultiSelected;
    }
  }

  select(region: RegionController) {
    this.state.select(region);
  }

  ctrlSelect(region: RegionController) {
    this.state.ctrlSelect(region);
  }
}

export interface ISelectManager {
  selectedArray;

  select(region: RegionController);

  ctrlSelect(region: RegionController);

  include(region: RegionController): boolean;

  delete(region: RegionController);

  clear();
}
