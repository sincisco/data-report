import {KeyValueDiffer} from '@angular/core';
import {GraphicConfig} from '../../config/design/graphic.config';
import {session} from '../../node/utils/session';
import {ChangedItem} from '@core/node/event/model.event';

export class RuntimeConfigSource extends GraphicConfig {
  private _option: any;
  private _differ: KeyValueDiffer<any, any>;

  constructor() {
    super();
    this._differ = session.differs.find({}).create();
  }

  importOption(option: any) {
    this._option = option;

    const array = [],
      changes = this._differ.diff(option);
    if (changes) {
      changes.forEachRemovedItem((record) => {
        console.log('removedItem', JSON.stringify(record.key));
        array.push({
          key: `remove.${record.key}`,
          oldValue: record.previousValue,
          newValue: record.currentValue,
          option
        });
      });
      changes.forEachAddedItem((record) => {
        array.push({
          key: `add.${record.key}`,
          oldValue: record.previousValue,
          newValue: record.currentValue,
          option
        });
        console.log('addedItem', JSON.stringify(record.key));
      });
      changes.forEachChangedItem((record) => {
        console.log('changedItem', JSON.stringify(record.key));
        array.push({
          key: record.key,
          oldValue: record.previousValue,
          newValue: record.currentValue,
          option
        });
      });
      array.push({
        key: 'option',
        oldValue: option,
        newValue: option,
        option
      });
    }
    if (array.length > 0) {
      this._update(array);
    }

  }

  private _update(changeItemArray: Array<ChangedItem>) {
    changeItemArray.forEach((value, index, array) => {
      this._trigger(value);
    });
  }
}
