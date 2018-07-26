import * as _ from 'lodash';

interface IFilter {

}

type FieldType = 'string' | 'number' | 'boolean';

interface IField {
  fieldName: string;
  fieldType?: FieldType;
}

interface ITable {
  data: Array<IRow>;
}

interface IRow {
  [key: string]: any;
}

interface OrderDef {
  fieldName: string;
  sort?: 'asc' | 'desc';
}

type IColumn = Array<any>;

export class DataSet {
  data: Array<IRow>;

  constructor(param: Array<IRow>) {
    this.data = param || [];
  }

  selectColumn(field: IField): IColumn {
    const retArray = [];
    this.data.forEach((value, index, array) => {
      retArray.push(value[field.fieldName]);
    });
    console.log(retArray);
    return retArray;
  }

  selectTable(fieldArray: Array<IField>): ITable {
    const retArray = [];
    this.data.forEach((row, index, array) => {
      var obj = {};
      fieldArray.forEach((field) => {
        obj[field.fieldName] = row[field.fieldName];
      });
      retArray.push(obj);
    });
    this.data = retArray;
    return this;
  }

  orderBy(orderDef: OrderDef) {
    this.data = _.orderBy(this.data, [orderDef.fieldName], [orderDef.sort]);
    return this;
  }

  top(num: number) {
    this.data = _.take(this.data, num);
    return this;
  }

  orderByMulti() {
    //_.orderBy(users, ['user', 'age'], ['asc', 'desc']);
  }

  private _distinct(array: Array<IRow>): Array<IRow> {
    var retArray = [];
    array.forEach((item) => {
      //retArray.forEach();
    });
    return retArray;
  }

}
