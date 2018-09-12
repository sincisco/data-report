import {BehaviorSubject, Subscription} from 'rxjs';


type DataHandler = (data: any) => void;

export interface IDataSubject {
  register(handler: DataHandler);

  cancel(handler: DataHandler);

  destroy();
}


export abstract class DataSubject implements IDataSubject {
  private _subject = new BehaviorSubject(null);

  private _subscriptionMap = new Map<DataHandler, Subscription>();

  protected _send(data: any) {
    if (!this._subject.closed) {
      this._subject.next(data);
    }
  }

  register(handler: DataHandler) {
    if (!this._subscriptionMap.has(handler)) {
      this._subscriptionMap.set(handler, this._subject.subscribe({
        next: handler
      }));
    }
  }

  cancel(handler: DataHandler) {
    if (this._subscriptionMap.has(handler)) {
      this._subscriptionMap.get(handler).unsubscribe();
      this._subscriptionMap.delete(handler);
    }
  }

  clear() {
    this._subscriptionMap.forEach((value, key, map) => {
      value.unsubscribe();
    });
    this._subscriptionMap.clear();
  }

  destroy() {
    this.clear();
    this._subject.unsubscribe();
  }

}

export class ChartDataSubject extends DataSubject {
  constructor() {
    super();
    setInterval(() => {
      this._send({
        // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
        // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
        dimensions: [{name: 'product', type: 'ordinal'}, {name: '2015', type: 'int'}, {name: '2016', type: 'int'}, {
          name: '2017',
          type: 'int'
        }],
        source: [
          {product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7},
          {product: 'Milk Tea', '2015': Math.random() * 100, '2016': 73.4, '2017': 55.1},
          {product: 'Cheese Cocoa', '2015': Math.random() * 100, '2016': 65.2, '2017': 82.5},
          {product: 'Walnut Brownie', '2015': Math.random() * 100, '2016': 53.9, '2017': 39.1}
        ]
      });
    }, 5000);
  }
}
