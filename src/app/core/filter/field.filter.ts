import {BaseFilter} from '@core/filter/filter.interface';

import * as _ from 'lodash';

interface IFieldFilterRule {
  fieldNameList: Array<string>;
}

export class FieldFilter extends BaseFilter {
  private readonly _config: IFieldFilterRule;

  constructor(config: any) {
    super(config);
    this._config = <IFieldFilterRule>config;
  }

  execute(table: Array<{ [key: string]: any }>) {
    return table.map((value, index, array) => {
      return _.pick(value, this._config.fieldNameList);
    });
  }
}


