import {Region} from '../region/region';
import {RegionState} from '@core/node/region/region.model';

enum SelectStatus {
  default, single, multi
}

/**
 * 被删除的region如何剔除
 */
class Store {
  private _selected: Region = null;
  private _multiSelectArray: Array<Region> = [];

  get status(): SelectStatus {
    if (this._selected === null) {
      if (this._multiSelectArray.length === 0) {
        return SelectStatus.default;
      } else if (this._multiSelectArray.length > 1) {
        return SelectStatus.multi;
      }
    } else {
      return SelectStatus.single;
    }
  }

  get selectedArray() {
    return this._multiSelectArray.slice(0);
  }

  /**
   * 判断传入region是否被选中
   * @param {Region} region
   * @returns {boolean}
   */
  isSelected(region: Region) {
    return this._selected === region ? true : false;
  }

  /**
   * 判断传入元素是否包含在多选集合中
   *
   * 删除元素的时候，判断该Region是否被选中
   * 如果没有被选中 那么只删除当前region
   * 否则删除r被选中的region组
   * @param {Region} region
   * @returns {boolean}
   */
  include(region: Region) {
    return this._multiSelectArray.includes(region);
  }

  addSelected(region: Region) {
    if (this._selected === region) {
      return;
    } else {
      this.clearSelected();
      region.state = RegionState.selected;
      this._selected = region;
    }
  }

  /**
   * multiselected的数目不能低于二   这个规则在添加方法最后不需要校验，但在删除方法最后需要校验
   * @param region
   */
  addMultiSelected(region: Region) {
    if (!this.include(region)) {
      region.state = RegionState.multiSelected;
      this._multiSelectArray.push(region);
    }
  }

  removeMultiSelected(region: Region) {
    if (this._multiSelectArray.includes(region)) {
      region.state = RegionState.default;
      this._multiSelectArray.splice(this._multiSelectArray.indexOf(region), 1);

      if (this._multiSelectArray.length === 1) {
        const region1 = this._multiSelectArray[0];
        this.clearTotalMultiSelected();
        this.addSelected(region1);
      }
    }
  }

  clearSelected(): Region {
    const retRegion = this._selected;
    this._selected = null;
    if (retRegion) {
      retRegion.state = RegionState.default;
    }
    return retRegion;
  }

  clearTotalMultiSelected() {
    while (this._multiSelectArray.length > 0) {
      const region = this._multiSelectArray.pop();
      region.state = RegionState.default;
    }
  }

  clear() {
    this.clearSelected();
    this.clearTotalMultiSelected();
  }

  /**
   * 当元素从页面删除的时候 需要清空selectManager对它的引用
   * @param region
   */
  delete(region: Region) {
    if (this._selected === region) {
      this._selected = null;
    } else if (this.include(region)) {
      this._multiSelectArray.splice(this._multiSelectArray.indexOf(region), 1);
    }
  }
}

abstract class State {
  protected constructor(protected store: Store) {
  }

  abstract select(region: Region);

  abstract ctrlSelect(region: Region);
}

class StateDefault extends State {
  constructor(store) {
    super(store);
  }

  select(region: Region) {
    this.store.addSelected(region);
  }

  ctrlSelect(region: Region) {
    this.select(region);
  }
}

class StateSelected extends State {
  constructor(store: Store) {
    super(store);
  }

  select(region: Region) {
    this.store.addSelected(region);
  }

  ctrlSelect(region: Region) {
    if (this.store.isSelected(region)) {
      return;
    } else {
      this.store.addMultiSelected(this.store.clearSelected());
      this.store.addMultiSelected(region);
    }
  }
}

class StateMultiSelected extends State {
  constructor(store) {
    super(store);
  }

  select(region: Region) {
    this.store.clearTotalMultiSelected();
    this.store.addSelected(region);
  }

  ctrlSelect(region: Region) {
    if (this.store.include(region)) {
      this.store.removeMultiSelected(region);
    } else {
      this.store.addMultiSelected(region);
    }
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

  select(region: Region) {
    this.state.select(region);
  }

  ctrlSelect(region: Region) {
    this.state.ctrlSelect(region);
  }
}

export interface ISelectManager {
  selectedArray;

  select(region: Region);

  ctrlSelect(region: Region);

  include(region: Region): boolean;

  delete(region: Region);

  clear();
}
