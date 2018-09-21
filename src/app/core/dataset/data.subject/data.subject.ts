import {BehaviorSubject, Subscription} from 'rxjs';
import {Dimensions} from '@core/node/interface';


type DataHandler = (data: any) => void;

export interface IDataSubject {

  metaData: Array<Dimensions>;

  register(handler: DataHandler);

  cancel(handler: DataHandler);

  destroy();
}


export abstract class DataSubject implements IDataSubject {
  metaData: Array<Dimensions>;

  private _subject = new BehaviorSubject(null);

  private _subscriptionMap = new Map<DataHandler, Subscription>();

  protected constructor() {
    this._subject = new BehaviorSubject(null);
    this._subscriptionMap = new Map<DataHandler, Subscription>();
  }

  protected _send(data: any) {
    if (!this._subject.closed) {
      this._subject.next(data);
    }
  }

  register(handler: DataHandler) {
    if (!this._subscriptionMap.has(handler)) {
      this._subscriptionMap.set(handler, this._subject.subscribe({
        next: handler
      }));
    }
  }

  cancel(handler: DataHandler) {
    if (this._subscriptionMap.has(handler)) {
      this._subscriptionMap.get(handler).unsubscribe();
      this._subscriptionMap.delete(handler);
    }
  }

  clear() {
    this._subscriptionMap.forEach((value, key, map) => {
      value.unsubscribe();
    });
    this._subscriptionMap.clear();
  }

  destroy() {
    this.clear();
    this._subject.unsubscribe();
  }

}
