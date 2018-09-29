export interface IDataSourceOption {
  type: string;
  id: string;
  displayName: string;
  comment: string;
}

export interface Dimension {
  name: string;
  type: 'number' | 'ordinal' | 'float' | 'int' | 'time';
}
