import {DataSource} from '../data.source';

export class TableDataSubject extends DataSource {
  constructor() {
    super();
    setInterval(() => {
      this._send({
        // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
        // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
        dimensions: [
          {name: '学校', type: 'ordinal'},
          {name: '院士人数', type: 'int'},
          {name: '综合排名', type: 'int'}],
        source: [
          {'学校': '北京大学', '院士人数': '100', '综合排名': '2'},
          {'学校': '清华大学', '院士人数': '120', '综合排名': '1'},
          {'学校': '南京大学', '院士人数': '30', '综合排名': '7'},
          {'学校': '上海交通大学', '院士人数': '30', '综合排名': '6'},
          {'学校': '复旦大学', '院士人数': '20', '综合排名': '5'},
          {'学校': '浙江大学', '院士人数': '45', '综合排名': '3'},
        ]
      });
    }, 5000);
  }
}
