import {IDataSourceOption} from '@core/node/source/data.source/data.source.option';

export const array: Array<IDataSourceOption> = [
  {
    classId: 'staticDataSource',
    id: 'easy',
    displayName: '静态数据源1',
    comment: '没有任何建议',
    metaData: [
      {name: 'product', type: 'ordinal'},
      {name: '2015', type: 'int'},
      {name: '2016', type: 'int'},
      {name: '2017', type: 'int'}],
    data: [
      {product: '花露水', '2015': 43.3, '2016': 85.8, '2017': 93.7},
      {product: '太极拳', '2015': Math.random() * 100, '2016': 73.4, '2017': 55.1},
      {product: '黄瓜', '2015': Math.random() * 100, '2016': 65.2, '2017': 82.5},
      {product: '花生', '2015': Math.random() * 100, '2016': 53.9, '2017': 39.1}
    ]
  }
];
