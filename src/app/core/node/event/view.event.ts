import * as _ from 'lodash';
import {IEventTarget} from '@core/node/event/event';

/**
 * 只能先“订阅”再“发布”
 * 全局对象会产生命名冲突
 * 观察者模式有两个明显的优点
 时间上解耦
 对象间解耦

 它应用广泛，但是也有缺点
 创建这个函数同样需要内存，过度使用会导致难以跟踪维护
 * */
export class ViewEventTarget implements IEventTarget {
  private _map: Map<string, Array<Function>> = new Map();

  addEventListener(eventName: string, callback: Function) {
    if (!this._map.has(eventName)) {
      this._map.set(eventName, [callback]);
    } else {
      this._map.get(eventName).push(callback);
    }

  }

  dispatchEvent(...args: Array<any>) {
    const eventName = args.shift(); // 第一个参数指定“键”
    if (!this._map.has(eventName)) {
      return false; // 如果回调数组不存在或为空则返回false
    }
    this._map.get(eventName).forEach((value) => {
      value.apply(this, args); // 循环回调数组执行回调函数
    });
  }

  removeEventListener(eventName: string, fn?: Function) {
    const fns = this._map.get(eventName);
    if (!fns) {
      return false;
    }
    if (!fn) { // 如果没有传入fn回调函数，直接取消key对应消息的所有订阅
      fns.splice(0, fns.length);
    } else {
      if (fns.includes(fn)) {
        _.remove(fns, (value, index, array) => {
          return value === fn;
        });
      }
    }
  }

  destroy() {
    if (this._map) {
      this._map.clear();
      this._map = null;
    }
  }
}
