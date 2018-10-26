import * as _ from 'lodash';
import {Observable, Subject} from 'rxjs';
import {ChangedItem} from '@core/node/event/model.event';

type KeyValueListener = (key: string, oldValue: any, newValue: any, option?: any) => void;

export abstract class GraphicConfig {
  private _destroyed = false;
  private _callbacksOnDestroy: Array<Function> = [];
  private _map: Map<string, KeyValueListener> = new Map();
  protected _subject: Subject<any>;

  abstract importOption(option: any);

  exportOption() {
  }

  get configSource(): Observable<any> {
    return this._subject;
  }

  get destroyed(): boolean {
    return this._destroyed;
  }

  protected _trigger(item: ChangedItem) {
    if (this._map && this._map.has(item.key)) {
      console.log('handle: ', item.key);
      const listener = this._map.get(item.key);
      listener(item.key, item.oldValue, item.newValue, item.option);
    }
  }


  register(eventType: string, listener: KeyValueListener) {
    if (_.isFunction(listener)) {
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

  onDestroy(callback: Function) {
    if (_.isFunction(callback)) {
      this._callbacksOnDestroy.push(callback);
    }
  }

  /**
   * 清空该源上面的所有事件监听
   */
  clear() {
    this._map.clear();
  }

  destroy() {
    this.clear();
    delete this._map;
    while (this._callbacksOnDestroy.length) {
      this._callbacksOnDestroy.pop()();
    }
    this._destroyed = true;
  }
}





