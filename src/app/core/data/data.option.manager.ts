import {DataOptionSet} from '@core/data/data.option.set';

/**
 * 管理多个空间的DataOption
 * 相同空间的DataOption被存放在同一个DataOptionSet中
 */
export class DataOptionManager {
  private _map = new Map();

  addDataOptionSet(id: string, dataOptionSet: DataOptionSet) {
    this._map.set(id, dataOptionSet);
  }

  getDataOptionSet(id: string) {
    if (this._map.has(id)) {
      return this._map.get(id);
    }
  }
}


