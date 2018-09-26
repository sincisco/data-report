import {BehaviorSubject, Subscription} from 'rxjs';
import {Dimensions} from '../../interface';
import {filter} from 'rxjs/operators';
import * as _ from 'lodash';

import {Source} from '../source';


type DataListener = (data: any) => void;

export abstract class DataSource extends Source {
  metaData: Array<Dimensions>;

  private _subject = new BehaviorSubject(null);

  private _subscriptionArray: Array<Subscription> = [];

  protected constructor() {
    super();
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

  clear() {
    while (this._subscriptionArray.length) {
      this._subscriptionArray.pop().unsubscribe();
    }
  }

  destroy() {
    this.clear();
    this._subject.unsubscribe();
  }

}
