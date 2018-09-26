import * as _ from 'lodash';
import {Source} from '../source';

type KeyValueListener = (key: string, oldValue: any, newValue: any, option?: any) => void;

export interface ChangeItem {
  key: string;
  oldValue: any;
  newValue: any;
  option: any;
}

export class ConfigSource extends Source {
  private _map: Map<string, KeyValueListener> = new Map();

  protected trigger(item: ChangeItem) {
    if (this._map && this._map.has(item.key)) {
      console.log('handle: ', item.key);
      const listener = this._map.get(item.key);
      listener(item.key, item.oldValue, item.newValue, item.option);
    }
  }

  public register(eventType: string, listener: KeyValueListener) {
    if (_.isFunction(listener)) {
      const eventArray = eventType.trim().replace(/\s+/g, ' ').split(' ');
      eventArray.forEach((value, index, array) => {
        this._map.set(value, listener);
      });
    }
    return this;
  }

  clear() {
    this._map.clear();
  }

  destroy() {
    this.clear();
    delete this._map;
    super.destroy();
  }
}





