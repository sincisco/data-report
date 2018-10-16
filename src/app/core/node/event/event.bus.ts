import {RegionController} from '@core/node/region/region.controller';
import {IPage} from '@core/node/interface';

type ICallback = (event: EventMessage) => void;

class EventType {
  private _eventName: string;
  private _tags: Array<string> = [];

  set eventName(param: string) {
    this._eventName = param;
  }

  addTag(tag: string) {
    this._tags.push(tag);
  }

  accept(eventType: string) {

  }
}

export class EventBus {
  private static _instanceMap: Map<IPage, EventBus> = new Map();

  private _cache = new Map();

  private _methodCache = new Map();

  static getInstance(page: IPage) {
    if (EventBus._instanceMap.has(page)) {
      return EventBus._instanceMap.get(page);
    } else {
      EventBus._instanceMap.set(page, new EventBus());
      return EventBus._instanceMap.get(page);
    }
  }

  constructor() {

  }

  /**
   *
   * @param {string} eventType
   * @param {Function} callback
   */
  register(eventType: string, callback: Function) {
    if (eventType && callback) {
      const callbackArray = this._cache.get(eventType) || [];
      callbackArray.push(callback);
      this._cache.set(eventType, callbackArray);
    }
    return this;
  }

  registerMethod(methodName: string, method: Function) {
    if (methodName && method) {
      this._cache.set(methodName, method);
    }
    return this;
  }

  trigger(eventType, eventMessage: EventMessage) {
    if (this._cache.has(eventType)) {
      this._cache.get(eventType).forEach((value) => {
        value(eventMessage);
      });
    }

  }

  invoke(methodName: string, param1?: any, param2?: any, param3?: any, param4?: any) {
    const params = arguments;

    Array.prototype.shift.call(params); // 第一个参数指定“键”
    if (!this._methodCache.has(methodName)) {
      return false; // 如果回调数组不存在或为空则返回false
    }

    this._methodCache.get(methodName).apply(this, params);
  }

  private _parseEventType(param: string) {
    const eventTypeArray = param.trim().replace(/\s+/g, ' ').split(' ');
    return eventTypeArray.map((value) => {
    });
  }
}

interface EventListener {
  listen(eventBus: EventBus);
}

export class EventMessage {
  eventName: string;
  tags: Array<string> = [];

  private _target: RegionController;

  constructor() {

  }

  get target() {
    return this._target;
  }
}
