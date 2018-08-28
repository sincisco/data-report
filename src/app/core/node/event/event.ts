export interface IEventTarget {
  addEventListener(eventName: string, callback: Function);

  removeEventListener(eventName: string, fn?: Function);
}
