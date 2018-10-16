export interface IEventTarget {
  addEventListener(eventName: string, callback: Function);

  removeEventListener(eventName: string, fn?: Function);
}



export type KeyValueListener = (key: string, oldValue: any, newValue: any, option?: any) => void;

export interface IModelEventTarget {
  register(eventType: string, listener: KeyValueListener): IModelEventTarget;

}
