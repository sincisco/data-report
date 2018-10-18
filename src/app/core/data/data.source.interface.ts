type IDataGenerator = () => Array<any> | Object;

export interface MockDynamicDataSourceConfig {
  intervalTime: number;
  dataGenerator: IDataGenerator;
}

export interface ArrayDataSourceMeta {
  id: string;
  displayName: string;
  dimensions: Array<any>;
}
