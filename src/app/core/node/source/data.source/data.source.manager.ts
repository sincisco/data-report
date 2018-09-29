import {IDataSourceOption} from '@core/node/source/data.source/data.source.option';
import {StaticDataSource} from '@core/node/source/data.source/static.data.source';
import {IDataSource} from '@core/node/source/data.source/data.source';

const map = new Map<string, any>();

map.set('staticDataSource', StaticDataSource);

export class DataSourceManager {
  private _dataSourceArray = [];

  load(optionArray: Array<IDataSourceOption>) {
    optionArray.forEach((value, index, array) => {
      if (map.has(value.type)) {
        const dataSourceClass: IDataSource = map.get(value.type);

      }
    });
  }
}
