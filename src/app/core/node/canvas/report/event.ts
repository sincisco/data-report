import * as _ from 'lodash';
import {IModel} from '../../../../components/page.config/page.model';

/**
 * 只能先“订阅”再“发布”
 * 全局对象会产生命名冲突
 * 观察者模式有两个明显的优点
 时间上解耦
 对象间解耦

 它应用广泛，但是也有缺点
 创建这个函数同样需要内存，过度使用会导致难以跟踪维护
 * */
export class ViewEventTarget {
  private _callbacks: { [key: string]: Array<Function> } = {};

  constructor() {

  }

  addEventListener(eventName: string, callback: Function) {
    if (!this._callbacks[eventName]) {
      this._callbacks[eventName] = [callback];
    } else {
      this._callbacks[eventName].push(callback);
    }

  }

  dispatchEvent(eventName1: string, param1?: any, param2?: any, param3?: any, param4?: any) {
    const params = arguments,
      eventName = Array.prototype.shift.call(params); // 第一个参数指定“键”
    if (!this._callbacks[eventName]) {
      return false; // 如果回调数组不存在或为空则返回false
    }
    this._callbacks[eventName].forEach((value) => {
      value.apply(this, params); // 循环回调数组执行回调函数
    });
  }

  removeEventListener(eventName: string, fn?: Function) {
    const fns = this._callbacks[eventName];
    if (!fns) {
      return false;
    }
    if (!fn) { // 如果没有传入fn回调函数，直接取消key对应消息的所有订阅
      this._callbacks[eventName] = [];
    } else {
      if (fns.includes(fn)) {
        _.remove(fns, (value, index, array) => {
          return value === fn;
        });
      }
    }
  }
}

export interface IView extends IEventSource {
  // 试图到模型
  bind();

  // 模型到视图
  listenToModel(model: IModel);

  destroy();
}

export interface IEventSource {
  on(eventName: string, callback: Function);

  off(eventName: string, fn?: Function);
}

export interface IModelObserver {
  addModelListener(model);
}

