
import {DataSource, IDataSource} from './data.source';
import {Dimension, IDataSourceOption} from '../../data/data.model.interface';

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

    setInterval(() => {
      this._send({
        // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
        // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
        dimensions: [{name: 'product', type: 'ordinal'}, {name: '2015', type: 'int'}, {name: '2016', type: 'int'}, {
          name: '2017',
          type: 'int'
        }],
        source: [
          {product: '化学', '2015': 43.3, '2016': 85.8, '2017': 93.7},
          {product: '牛奶', '2015': Math.random() * 100, '2016': 73.4, '2017': 55.1},
          {product: '吃饭', '2015': Math.random() * 100, '2016': 65.2, '2017': 82.5},
          {product: '豆子', '2015': Math.random() * 100, '2016': 53.9, '2017': 39.1}
        ]
      });
    }, 5000);
  }

}
