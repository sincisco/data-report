import {DataSource} from './data.source';
import {Dimensions} from '../../interface';

class StaticDataSource extends DataSource {
  constructor(metaData: Array<Dimensions>, data: any) {
    super();
    this.metaData = metaData;
    this._send(data);
  }
}
