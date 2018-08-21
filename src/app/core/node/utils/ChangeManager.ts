type KeyValueListener = (key: string, oldValue: any, newValue: any, option?: any) => void;

export interface ChangeItem {
  key: string;
  oldValue: any;
  newValue: any;
  option: any;
}

export class ChangeManager {
  private _map = new Map();

  protected register(eventType: string, listener: KeyValueListener) {
    this._map.set(eventType, listener);
  }

  protected trigger(item: ChangeItem) {
    console.log('handle: ', item.key);
    if (this._map.has(item.key)) {
      const listener = this._map.get(item.key);
      listener(item.key, item.oldValue, item.newValue, item.option);
    }
  }
}





