import {interval, Observable, of} from 'rxjs';
import {map, publishBehavior, refCount} from 'rxjs/operators';
import {MockDynamicDataSourceConfig} from '@core/model/data/interface';
import {IDataSourceOption} from '@core/model/data/data.source.option';
import {array} from '@core/model/data/test';

export class DataSourceFactory {

  private static _dataSourceFactory: DataSourceFactory;

  private _dataSourceMap = new Map<string, Observable<any>>();

  static getInstance() {
    if (!this._dataSourceFactory) {
      this._dataSourceFactory = new DataSourceFactory(array);
    }
    return this._dataSourceFactory;
  }

  constructor(private _dataSourceArray: Array<IDataSourceOption>) {
  }


  get dataSourceArray(): Array<IDataSourceOption> {
    return this._dataSourceArray.slice(0);
  }

  getDataSource(optionID: string): Observable<any> {


    const dataOption = this._dataSourceArray.find((value, index, obj) => value.id === optionID);
    // : { , configType: 'mockStatic' | 'mockDynamic', config: any }

    const {id, configType, config} = dataOption;
    if (this._dataSourceMap.has(id)) {
      return this._dataSourceMap.get(id);
    } else {
      let dataSource;
      switch (configType) {
        case 'mockStatic':
          dataSource = this._createMockStaticDataSource(config);
          break;
        case 'mockDynamic':
          dataSource = this._createMockDynamicDataSource(config);
          break;
      }
      this._dataSourceMap.set(id, dataSource);
      return dataSource;
    }
  }

  /**
   * 模拟静态数据源创建
   * @param config
   * @returns {Observable<any>}
   * @private
   */
  private _createMockStaticDataSource(config: any) {
    return of(config);
  }

  /**
   * 模拟动态数据源
   * 1、当最后一个Observer停止监听的时候  撤销定时任务
   * 2、当有一个Observer开始监听 立即调用数据生成器  并开启定时任务
   * @param config
   * @private
   */
  private _createMockDynamicDataSource(config: MockDynamicDataSourceConfig) {
    const {intervalTime = 5000, dataGenerator} = config;
    const ticker = interval(intervalTime);
    return ticker
      .pipe(
        map((value, index) => {
          return dataGenerator();
        }),
        publishBehavior(dataGenerator()),
        refCount());
  }
}



