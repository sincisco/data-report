import * as _ from 'lodash';

export abstract class Source {
  private _destroyed = false;
  private _callbacksOnDestroy: Array<Function> = [];

  /**
   * 清空该源上面的所有事件监听
   */
  abstract clear();

  get destroyed(): boolean {
    return this._destroyed;
  }

  destroy(): void {
    while (this._callbacksOnDestroy.length) {
      this._callbacksOnDestroy.pop()();
    }
    this._destroyed = true;
  }

  onDestroy(callback: Function) {
    if (_.isFunction(callback)) {
      this._callbacksOnDestroy.push(callback);
    }
  }
}
