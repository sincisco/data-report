import {IDataOptionOption} from '@core/data/data.option.interface';
import {Observable} from 'rxjs';
import {DataOptionSet} from '@core/data/data.option.set';
import {DataSourceFactory} from '@core/data/data.source.factory';

export class DataSourceManager {
  private _dataSourceMap: Map<string, Observable<any>> = new Map();

  constructor(private _dataOptionSet: DataOptionSet) {

  }

  load(optionArray: Array<IDataOptionOption>) {

  }

  clear() {

  }

  getDataSourceByID(id: string): Observable<any> {
    if (this._dataSourceMap.has(id)) {
      return this._dataSourceMap.get(id);
    } else if (this._dataOptionSet.getDataOption(id)) {
      const dataSource = DataSourceFactory
        .getInstance()
        .getDataSource(this._dataOptionSet.getDataOption(id));
      this._dataSourceMap.set(id, dataSource);
      return dataSource;
    }
    return null;
  }
}
