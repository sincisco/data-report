import {DataSource} from './data.source';
import {Dimension} from '../../data/data.model.interface';

interface UrlDataSubjectOption {
  url: string;
  // 如果没有设置则只获取一次数据，否则根据设定时间刷新数据 刷新时间不能低于5秒，低于5秒按5秒计算
  internal?: number;
  dataPath?: string;

}

class UrlDataSource extends DataSource {
  metaData: Array<Dimension>
  constructor(metaData: Array<Dimension>, data: any) {
    super();
    this.metaData = metaData;
    this._send(data);
  }
}
