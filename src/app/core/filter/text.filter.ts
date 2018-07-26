import {BaseFilter} from '@core/filter/filter.interface';

type TextFilterType = 'include' | 'startWith' | 'endWith' | 'exclude' | 'equal';

interface ITextFilterRule {
  fieldName: string;
  matchingType?: 'some' | 'every';
  list: Array<{
    textFilterType: TextFilterType;
    text: string;
  }>;
}

export class TextFilter extends BaseFilter {
  private readonly _config: ITextFilterRule;

  constructor(config: any) {
    super(config);
    this._config = <ITextFilterRule>config;
  }

  execute(table: Array<{ [key: string]: any }>) {
    return table.filter((row, index) => {
      const targetField: string = row[this._config.fieldName];
      if (this._config.matchingType === 'every') {
        return this._config.list.every((value, index, array) => {
          const text = value.text;
          switch (value.textFilterType) {
            case 'include':
              return targetField.includes(text);
            case 'startWith':
              return targetField.startsWith(text);
            case 'endWith':
              return targetField.endsWith(text);
            case 'exclude':
              return !targetField.includes(text);
            case 'equal':
              return targetField === text;
          }
        });
      } else {
        return this._config.list.some((value, index, array) => {
          const text = value.text;
          switch (value.textFilterType) {
            case 'include':
              return targetField.includes(text);
            case 'startWith':
              return targetField.startsWith(text);
            case 'endWith':
              return targetField.endsWith(text);
            case 'exclude':
              return !targetField.includes(text);
            case 'equal':
              return targetField === text;
          }
        });
      }
    });
  }
}


