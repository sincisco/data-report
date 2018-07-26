import * as _ from 'lodash';
import {BaseFilter} from '@core/filter/filter.interface';

type OrderType = 'asc' | 'desc' | null | undefined;

interface ISortRule {
  fieldName: string;
  order?: OrderType;
}

export class SortFilter extends BaseFilter {
  private _config: Array<ISortRule>;

  constructor(config: any) {
    super(config);
    this._config = <Array<ISortRule>>config;
  }

  execute(table: Array<{ [key: string]: any }>) {
    const iteratees = [], orders = [];
    this._config.forEach((value: ISortRule) => {
      iteratees.push(value.fieldName);
      orders.push(value.order || 'asc');
    });
    return _.orderBy(table, iteratees, orders);
  }
}
