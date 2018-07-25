interface DimensionsItem {
  name: string;
  type: 'number' | 'ordinal' | 'float' | 'int' | 'time';
}

type Dimensions = Array<DimensionsItem>;

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
  dimensions?: Dimensions;
  sourceHeader?: null | undefined | boolean;
}

export interface DatasetWrapper {
  name: string;
  displayName: string;
  dataset: Dataset;
}
