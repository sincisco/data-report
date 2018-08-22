import {Type} from '@angular/core';

enum GraphicState {
  uninitialized, initialized, normal, destroyed
}

export interface IGraphic {
  $element: JQuery;

  init(contentClass: Type<IContent>);

  load(option?: any);

  // 图标进入交互状态
  activate();

  deactivate();

  // 激活配置面板
  activateConfig();

  resize();

  update(option: any);

  updateTheme(theme: string);

  updateGraphic(option: any);

  getOption();

  render(option?: any);

  derender();

  destroy();
}

