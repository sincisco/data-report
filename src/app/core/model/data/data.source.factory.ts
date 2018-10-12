import {interval, of} from 'rxjs';
import {map, publishBehavior} from 'rxjs/operators';

export class DataSourceFactory {

  private _createMockStaticDataSource(config: any) {
    return of(config);
  }

  /**
   * 创建模拟动态数据源
   * 1、当最后一个Observer停止监听的时候  撤销定时任务
   * 2、当有一个Observer开始监听 立即调用数据生成器  并开启定时任务
   * @param config
   * @private
   */
  private _createMockDynamicDataSource(config: MockDynamicDataSourceConfig) {
    const {intervalTime = 5000, dataGenerator} = config;
    const ticker = interval(intervalTime);
    return ticker.pipe(map((value, index) => {
      return dataGenerator();
    }), publishBehavior(dataGenerator()));
  }
}

type IDataGenerator = () => Array<any> | Object;

interface MockDynamicDataSourceConfig {
  intervalTime: number;
  dataGenerator: IDataGenerator;
}

interface ArrayDataSourceMeta {
  id: string;
  displayName: string;
  dimensions: Array<any>;
}

