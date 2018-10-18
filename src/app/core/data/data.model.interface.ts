import {IDataSource} from '../source/data.source/data.source';

export interface Dimension {
  name: string;
  displayName?: string;
  comment?: string;
  type: 'number' | 'ordinal' | 'float' | 'int' | 'time';
}


/**
 *
 *
 * dataset.source 第一行/列是否是 维度名 信息。
 * 可选值：
 * null/undefine：默认，自动探测。
 * true：第一行/列是维度名信息。
 * false：第一行/列直接开始是数据。
 */
export interface Dataset {
  id?: string;
  source?: any;
  dimensions?: Array<Dimension>;
  sourceHeader?: null | undefined | boolean;
}

export interface DatasetWrapper {
  name: string;
  displayName: string;
  state: { collapsedDimension: boolean, collapsedMeasure: boolean };
  dimensions?: Array<Dimension>;
}

export interface IDataSourceOption {
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

