import {DataSubject} from '@core/dataset/data.subject/data.subject';
import {Dimensions} from '@core/node/interface';

class StaticDataSubject extends DataSubject {
  constructor(metaData: Array<Dimensions>, data: any) {
    super();
    this.metaData = metaData;
    this._send(data);
  }
}
