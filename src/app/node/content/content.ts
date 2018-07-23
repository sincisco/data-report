interface IContent {
  init(option: any);

  /**
   * 当区域的维度发生变化时，对内容进行重新自适应
   */
  resize();

  /**
   * 属性面板发生变化，更新内容
   * @param option
   */
  update(option: any);

  activate();
}
