import {Dimension} from '@core/data/data.model.interface';

export interface IDataOptionOption {
  id: string;
  displayName: string;
  configType: string;
  config: any;
  dataType: string;
  dimensions?: Array<Dimension>;
  [key: string]: any;
}
