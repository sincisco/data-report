import {BehaviorSubject, interval, Observable, of} from 'rxjs';
import {map, publishBehavior, refCount} from 'rxjs/operators';
import {MockDynamicDataSourceConfig, MockStaticDataSourceConfig} from './data.source.interface';
import {DataOption} from '@core/data/data.option';
import {dataModelManager} from '@core/data/data.model.manager';
import {array} from '@core/data/test';

export class DataSourceFactory {

  private static _dataSourceFactory: DataSourceFactory;

  private _dataSourceMap = new Map<string, Observable<any>>();

  // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
  // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。

  static getInstance() {
    if (!this._dataSourceFactory) {
      this._dataSourceFactory = new DataSourceFactory();
    }
    return this._dataSourceFactory;
  }

  private constructor() {
  }


  getDataSource(dataOption: DataOption): Observable<any> {
    if (dataOption) {
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
  }

  /**
   * 模拟静态数据源创建
   * @param config
   * @returns {Observable<any>}
   * @private
   */
  private _createMockStaticDataSource(config: MockStaticDataSourceConfig) {
    return new BehaviorSubject(config.data);
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
          console.log('***');
          return dataGenerator();
        }),
        publishBehavior(dataGenerator()),
        refCount());
  }
}

// array.forEach((value, index) => {
//   dataModelManager
//     .addDataModel(value.id, value.displayName);
// });



