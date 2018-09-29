import {Dimension, IDataSourceOption} from '@core/node/source/data.source/data.source.option';
import {DataSource, IDataSource} from '@core/node/source/data.source/data.source';

interface StaticDataSourceOption extends IDataSourceOption {
  metaData: Array<Dimension>;
  data: Array<any>;
}

export class StaticDataSource extends DataSource implements IDataSource {
  metaData: Array<Dimension>;

  constructor(option: StaticDataSourceOption) {
    super();
    this.metaData = option.metaData;
    this._send({
      dimensions: option.metaData,
      source: option.data
    });
  }

}
