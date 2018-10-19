import {IDataSource} from '../source/data.source/data.source';
import {Type} from '@angular/core';
import {IDataSourceItemRuntime} from './data.model.interface';
import {IDataOptionOption} from '@core/data/data.option.interface';

const map = new Map<string, Type<IDataSource>>();


export class DataSourceManager {
  private _dataSourceArray: Array<IDataSourceItemRuntime> = [];

  get dataSourceArray(): Array<IDataSourceItemRuntime> {
    return this._dataSourceArray.slice(0);
  }

  load(optionArray: Array<IDataOptionOption>) {
    optionArray.forEach((value, index, array) => {
      const {classId, id, displayName, comment} = value;
      if (map.has(classId)) {
        const dataSourceClass = map.get(classId);
        this._dataSourceArray.push({
          classId,
          id,
          displayName,
          comment,
          dataSource: new dataSourceClass(value)
        });
      }
    });
  }

  getDataSourceByID(id: string): IDataSource {
    return this._dataSourceArray.find((value, index) => {
      return value.id === id ? true : false;
    }).dataSource;
  }
}
