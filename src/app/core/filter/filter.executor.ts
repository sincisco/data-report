import {Type} from '@angular/core';
import {ListFilter} from '@core/filter/list.filter';
import {SortFilter} from '@core/filter/sort.filter';
import {BaseFilter, IFilterConfig} from '@core/filter/filter.interface';
import {TextFilter} from '@core/filter/text.filter';
import {FieldFilter} from '@core/filter/field.filter';
import {TakeFilter} from '@core/filter/take.filter';

class FilterExecutor {
  private _map: Map<string, Type<BaseFilter>> = new Map();

  execute(table: Array<{ [key: string]: any }>, filterArray: Array<IFilterConfig>) {
    return filterArray.reduce((previous, current, currentIndex) => {
      if (this._map.has(current.name)) {
        const FilterFactory: Type<BaseFilter> = this._map.get(current.name);
        return new FilterFactory(current.config).execute(previous);
      } else {
        return previous;
      }
    }, table);
  }

  register(name: string, filter: Type<BaseFilter>) {
    this._map.set(name, filter);
  }
}


export const filterExecutor = new FilterExecutor();

filterExecutor.register('listFilter', ListFilter);
filterExecutor.register('sortFilter', SortFilter);
filterExecutor.register('textFilter', TextFilter);
filterExecutor.register('fieldFilter', FieldFilter);
filterExecutor.register('takeFilter', TakeFilter);
