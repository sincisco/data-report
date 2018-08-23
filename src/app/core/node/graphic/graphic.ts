export interface IGraphic {
  $element: JQuery;

  init(option?: any);

  update(option: any);

  updateTheme(theme: string);

  updateGraphic(option: any);

  // 图标进入交互状态
  activate();

  deactivate();

  // 激活配置面板
  activateConfig();

  resize();

  getOption();

  render(option?: any);

  derender();

  destroy();
}

