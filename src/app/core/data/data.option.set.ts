import * as _ from 'lodash';

import {IDataOptionOption} from '@core/data/data.option.interface';
import {DataOption} from '@core/data/data.option';

export class DataOptionSet {

  private _parent: DataOptionSet;
  private _array: Array<DataOption> = [];

  constructor(dataOptionOptionArray?: IDataOptionOption | Array<IDataOptionOption>) {
    if (dataOptionOptionArray) {
      this.load(dataOptionOptionArray);
    }
  }

  set parent(value: DataOptionSet) {
    this._parent = value;
  }

  get dataOptionArray(): Array<DataOption> {
    if (this._parent) {
      return this._parent.dataOptionArray.concat(this._array);
    } else {
      return this._array.slice(0);
    }
  }

  getDataOption(id: string): DataOption {
    return this._array.find((value) => {
      return value.id === id;
    }) || (this._parent ? this._parent.getDataOption(id) : null);
  }

  load(dataOptionOptionArray: IDataOptionOption | Array<IDataOptionOption>) {
    if (_.isArray(dataOptionOptionArray)) {
      dataOptionOptionArray.forEach((value) => {
        this._load(value);
      });
    } else {
      this._load(dataOptionOptionArray);
    }
  }

  private _load(dataOptionOption: IDataOptionOption) {
    this._array.push(new DataOption(dataOptionOption));
  }
}
