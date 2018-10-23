import {DataOptionSet} from '@core/data/data.option.set';

/**
 * 管理多个空间的DataOption
 * 相同空间的DataOption被存放在同一个DataOptionSet中
 */
export class DataOptionManager {
  private static _dataOptionManager: DataOptionManager;

  private _map = new Map();

  // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
  // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。

  static getInstance() {
    if (!this._dataOptionManager) {
      this._dataOptionManager = new DataOptionManager();
    }
    return this._dataOptionManager;
  }

  private constructor() {
  }


  addDataOptionSet(id: string, dataOptionSet: DataOptionSet) {
    this._map.set(id, dataOptionSet);
  }

  getDataOptionSet(id: string) {
    if (this._map.has(id)) {
      return this._map.get(id);
    }
  }

  clear() {
  }
}

export const dataOptionManager = DataOptionManager.getInstance();


