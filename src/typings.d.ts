/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
  id: string;
}

declare var echarts: any;
declare var hljs: any;
declare var BalloonEditor: any;

interface Echart {
  setOption: Function;
  getOption: Function;
  showLoading: Function;
  hideLoading: Function;
  on: Function;
  off: Function;
  resize: Function;
  getWidth: Function;
  getHeight: Function;
  clear: Function;
  dispose: Function;
  isDisposed: Function;
}

interface Array<T> {
  contain(item): boolean;
}

