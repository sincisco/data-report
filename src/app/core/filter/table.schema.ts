import * as _ from 'lodash';

type ColumnType = 'string' | 'number' | 'boolean' | 'symbol' | 'object' | 'undefined' | 'function';

interface IColumn {
  id: string;
  text: string;
  type: ColumnType;
}

interface IRow {
  [key: string]: any;
}

export class TableSchema {
  _columnDefs: Array<IColumn> = [];
  _dimensionColumnDefs: Array<IColumn> = [];
  _measureColumnDefs: Array<IColumn> = [];

  constructor(_data: Array<IRow>) {
    if (_.isArray(_data) && _data.length > 0) {
      _.forOwn(_data[0], (value, key) => {
        this._columnDefs.push({
          id: _.uniqueId('fieldid_'),
          text: key,
          type: (typeof value)
        });
      });
    }

    this._columnDefs.forEach((value, index, array) => {
      if (value.type !== 'number') {
        this._dimensionColumnDefs.push(value);
      } else {
        this._measureColumnDefs.push(value);
      }
    });
  }

  preprocess() {

  }
}
