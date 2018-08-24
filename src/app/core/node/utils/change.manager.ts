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
    const eventArray = eventType.trim().replace(/\s+/g, ' ').split(' ');
    eventArray.forEach((value, index, array) => {
      this._map.set(value, listener);
    });
    return this;
  }

  protected trigger(item: ChangeItem) {
    if (this._map.has(item.key)) {
      console.log('handle: ', item.key);
      const listener = this._map.get(item.key);
      listener(item.key, item.oldValue, item.newValue, item.option);
    }
  }
}





