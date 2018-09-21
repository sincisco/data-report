import {DataSubject} from '@core/dataset/data.subject/data.subject';
import {Dimensions} from '@core/node/interface';

interface UrlDataSubjectOption {
  url: string;
  // 如果没有设置则只获取一次数据，否则根据设定时间刷新数据 刷新时间不能低于5秒，低于5秒按5秒计算
  internal?: number;
  dataPath?: string;

}

class UrlDataSubject extends DataSubject {
  constructor(metaData: Array<Dimensions>, data: any) {
    super();
    this.metaData = metaData;
    this._send(data);
  }
}
