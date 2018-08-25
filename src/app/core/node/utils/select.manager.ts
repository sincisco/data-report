import {Region} from '@core/node/region/region';

class Store {
  selected: Region = null;
  multiSelectArray: Array<Region> = [];

  addSelected(region: Region) {
    if (this.selected === region) {
      return;
    } else {
      this.clearSelected();
      region.select();
      this.selected = region;
    }
  }

  /**
   * 删除元素的时候，判断该Region是否被选中
   * 如果没有被选中 那么只删除当前region
   * 否则删除r被选中的region组
   */
  isRegionMultiSelected(region: Region): boolean {
    return this.multiSelectArray.includes(region);
  }

  /**
   * 当元素从页面删除的时候 需要清空selectManager对它的引用
   * @param region
   */
  delete(region: Region) {
    if (this.selected === region) {
      this.selected = null;
    } else if (this.multiSelectArray.includes(region)) {
      this.multiSelectArray.splice(this.multiSelectArray.indexOf(region), 1);
    }
  }



  clearSelected() {
    let retRegion;
    if (this.selected) {
      this.selected.unselect();
      retRegion = this.selected;
      this.selected = null;
    }
    return retRegion;
  }


  /**
   * multiselected的数目不能低于二   这个规则在添加方法最后不需要校验，但在删除方法最后需要校验
   * @param region
   */
  addMultiSelected(region: Region) {
    if (!this.multiSelectArray.includes(region)) {
      region.multiSelect();
      this.multiSelectArray.push(region);
    }
  }

  removeMultiSelected(region: Region) {
    if (this.multiSelectArray.includes(region)) {
      region.multiUnselect();
      this.multiSelectArray.splice(this.multiSelectArray.indexOf(region), 1);

      if (this.multiSelectArray.length === 1) {
        const region1 = this.multiSelectArray[0];
        this.clearTotalMultiSelected();
        this.addSelected(region1);
      }
    }
  }

  clearTotalMultiSelected() {
    while (this.multiSelectArray.length > 0) {
      const region = this.multiSelectArray.pop();
      region.multiUnselect();
    }
  }

  clear() {
    this.clearSelected();
    this.clearTotalMultiSelected();
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
    if (region === this.store.selected) {
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
    if (this.store.multiSelectArray.includes(region)) {
      this.store.removeMultiSelected(region);
    } else {
      this.store.addMultiSelected(region);
    }
  }
}

export class SelectManager extends Store {
  private readonly _stateDefault: State;
  private readonly _stateSelected: State;
  private readonly _stateMultiSelected: State;

  constructor() {
    super();
    this._stateDefault = new StateDefault(this);
    this._stateSelected = new StateSelected(this);
    this._stateMultiSelected = new StateMultiSelected(this);
  }

  get state(): State {
    if (!this.selected) {
      if (this.multiSelectArray.length === 0) {
        console.log('default');
        return this._stateDefault;
      } else {
        console.log('multiSelected');
        return this._stateMultiSelected;
      }
    } else {
      console.log('selected');
      return this._stateSelected;
    }
  }

  select(region: Region) {
    this.state.select(region);
  }

  ctrlSelect(region: Region) {
    this.state.ctrlSelect(region);
  }
}
