import {BaseFilter} from '@core/filter/filter.interface';

interface IListFilterRule {
  fieldName: string;
  list: Array<any>;
}

export class ListFilter extends BaseFilter {
  private readonly _config: IListFilterRule;

  constructor(config: any) {
    super(config);
    this._config = <IListFilterRule>config;
  }

  execute(table: Array<{ [key: string]: any }>) {
    return table.filter((value, index) => {
      console.log(value[this._config.fieldName]);
      return this._config.list.includes(value[this._config.fieldName]);
    });
  }
}


