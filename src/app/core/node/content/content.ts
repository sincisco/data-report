interface IContent {
  init(option: any);

  /**
   * 属性面板发生变化，更新内容 可以是增量更新，也可以是全量刷新
   * @param option
   */
  update(option: any);

  updateTheme(theme: string);

  getOption();

  /**
   * 全量刷新内容区域，防止长时间操作，导致内容状态不一致；
   */
  refresh();

  /**
   * 当区域的维度发生变化时，对内容进行重新自适应
   */
  resize();

  activate();

  deactivate();

  destroy();
}

interface ContentOption {
  type: string;

  [key: string]: any;
}
