import {IDataSource} from '@core/node/source/data.source/data.source';

export interface IDataSourceOption {
  classId: string;
  id: string;
  displayName: string;
  comment: string;
  [key: string]: any;
}

export interface IDataSourceItemRuntime {
  classId: string;
  id: string;
  displayName: string;
  comment: string;
  dataSource: IDataSource;
}

export interface Dimension {
  name: string;
  type: 'number' | 'ordinal' | 'float' | 'int' | 'time';
}
