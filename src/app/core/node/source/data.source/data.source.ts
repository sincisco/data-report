import {BehaviorSubject, Subscription} from 'rxjs';
import {Dimensions} from '../../interface';
import {filter} from 'rxjs/operators';
import * as _ from 'lodash';


type DataListener = (data: any) => void;

export abstract class DataSource {
  private _destroyed = false;
  private _callbacksOnDestroy: Array<Function> = [];

  metaData: Array<Dimensions>;

  private _subject = new BehaviorSubject(null);

  private _subscriptionArray: Array<Subscription> = [];

  protected constructor() {
    this._subject = new BehaviorSubject(null);
  }

  protected _send(data: any) {
    if (!this._subject.closed) {
      this._subject.next(data);
    }
  }

  register(listener: DataListener) {
    if (_.isFunction(listener)) {
      const subscription = this._subject
        .pipe(filter(data => !!data))
        .subscribe({
          next: listener
        });
      this._subscriptionArray.push(subscription);

      return subscription.add(() => {
        if (this._subscriptionArray.includes(subscription)) {
          this._subscriptionArray.splice(this._subscriptionArray.indexOf(subscription), 1);
        }
      });
    }
  }

  /**
   * 清空该源上面的所有事件监听
   */
  clear() {
    while (this._subscriptionArray.length) {
      this._subscriptionArray.pop().unsubscribe();
    }
  }

  destroy() {
    this.clear();
    this._subject.unsubscribe();

    while (this._callbacksOnDestroy.length) {
      this._callbacksOnDestroy.pop()();
    }
    this._destroyed = true;
  }

  get destroyed(): boolean {
    return this._destroyed;
  }

  onDestroy(callback: Function) {
    if (_.isFunction(callback)) {
      this._callbacksOnDestroy.push(callback);
    }
  }

}
