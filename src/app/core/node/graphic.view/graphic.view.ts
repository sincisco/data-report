/**
 * 图表内容
 * 该组件会被设计时和运行时共享，所以设计接口的时候需要注意
 * IGraphicView只负责图表的展现，并不保存图表的状态；所以没有getOption接口方法
 *
 * 设计时组件
 * 1、创建GraphicView组件
 * 2、更新配置信息
 * 3、更新数据信息
 * 4、激活模式下  GraphicView可能需要将某些信息反馈给ConfigSource
 *
 * 运行时组件
 * 1、创建GraphicView组件
 * 2、更新数据信息
 *
 */
export interface IGraphicView {
  $element: JQuery;

  /**
   * 属性面板发生变化，更新内容 可以是增量更新，也可以是全量刷新
   * @param option
   */
  update(option: any);

  updateConfig(config: any);

  updateData(data: any);

  updateTheme(theme: string);

  /**
   * 当区域的维度发生变化时，对内容进行重新自适应
   */
  resize();

  activate();

  deactivate();

  addEventListener(eventName: string, callback: Function);

  removeEventListener(eventName: string, fn?: Function);

  destroy();
}
