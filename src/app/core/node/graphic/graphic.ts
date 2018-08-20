import {Type} from '@angular/core';


export interface IGraphic {
  $element: JQuery;

  init(contentClass: Type<IContent>);

  // 图标进入交互状态
  activate();

  // 激活配置面板
  activateConfig();

  resize();

  update(option: any);

  updateTheme(theme: string);

  updateGraphic(option: any);

  getOption();

  destroy();
}

