import {KeyValueListener} from '@core/node/event/event';

export interface ChangedItem {
  key: string;
  oldValue: any;
  newValue: any;
  option: any;
}

export class ModelEventTarget {
  private _map = new Map();

  /**
   *
   * @param {string} eventType  "color color.add color.delete"
   * @param {KeyValueListener} listener
   * @returns {this}
   */
  public register(eventType: string, listener: KeyValueListener) {
    if (arguments.length === 2) {
      const eventArray = eventType
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ');
      eventArray.forEach((value, index, array) => {
        this._map.set(value, listener);
      });
    }
    return this;
  }


  protected _trigger(item: ChangedItem) {
    if (this._map.has(item.key)) {
      console.log('handle: ', item.key);
      const listener = this._map.get(item.key);
      listener(item.key, item.oldValue, item.newValue, item.option);
    }
  }

  protected _batchTrigger(changedItemArray: Array<ChangedItem>) {
    changedItemArray.forEach((value, index, array) => {
      this._trigger(value);
    });
  }

}

export class OuterModelEventTarget extends ModelEventTarget {
  trigger(item: ChangedItem) {
    this._trigger(item);
  }

  batchTrigger(changedItemArray: Array<ChangedItem>) {
    this._batchTrigger(changedItemArray);
  }
}







