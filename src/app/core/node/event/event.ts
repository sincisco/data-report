export interface IEventTarget {
  addEventListener(eventName: string, callback: Function);

  removeEventListener(eventName: string, fn?: Function);

  dispatchEvent(...args: Array<any>);
}

export interface IViewEventTarget extends IEventTarget {
  $element: JQuery;

  destroy();
}

export type KeyValueListener = (key: string, oldValue: any, newValue: any, option?: any) => void;

export interface IModelEventTarget {
  register(eventType: string, listener: KeyValueListener): IModelEventTarget;
}
