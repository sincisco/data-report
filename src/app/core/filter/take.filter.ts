import {BaseFilter} from '@core/filter/filter.interface';

import * as _ from 'lodash';

interface ITakeFilterRule {
  takeType: 'begin' | 'end';
  count: number;
}

export class TakeFilter extends BaseFilter {
  private readonly _config: ITakeFilterRule;

  constructor(config: any) {
    super(config);
    this._config = <ITakeFilterRule>config;
  }

  execute(table: Array<{ [key: string]: any }>) {
    if (this._config.takeType === 'end') {
      return _.takeRight(table, this._config.count);
    } else {
      return _.take(table, this._config.count);
    }
  }
}


