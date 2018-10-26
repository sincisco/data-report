import {Observable, Subscription} from 'rxjs';

export interface IGraphic {
  $element: JQuery;

  /**
   * 一般用于初始化  新建Graphic的时候调用
   * 如果有content的，则创建相应的content；负责配置面板的创建
   * @param option
   */
  init(...params: Array<any>);

  accept(modelObservable: Observable<any>): Subscription;

  /**
   * 更新全局样式 目前只有Echart图表使用的到
   * @param {string} theme
   */
  updateTheme(theme: string);

  resize();

  // graphic进入交互状态
  activate();

  deactivate();

  destroy();
}

export interface IGraphicOption {
  graphicKey: string;
  graphicId?: string;
  configOption?: any;
  dataOptionId?: string;
}

