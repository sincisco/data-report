import {GraphicConfig} from '@core/config/design/graphic.config';
import {Observable, Subscription} from 'rxjs';
import {Type} from '@angular/core';
import {IConfigSourceOption} from '@core/config/config.source.interface';

export interface IGraphic {
  $element: JQuery;

  configSource: GraphicConfig;

  addChild(child);

  /**
   * 一般用于初始化  新建Graphic的时候调用
   * 如果有content的，则创建相应的content；负责配置面板的创建
   * @param option
   */
  init(option?: any, runtime?: boolean);

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
  graphicClass: Type<IGraphic>;
  configSourceOption: IConfigSourceOption;
  dataOptionId: string;
}

