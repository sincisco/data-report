import {RuntimeConfigSource} from '../../source/config.source/runtime.config.source';

export interface IRuntimeGraphic {
  $element: JQuery;

  configSource: RuntimeConfigSource;

  addChild(child);

  /**
   * 一般用于初始化  新建Graphic的时候调用
   * 如果有content的，则创建相应的content；负责配置面板的创建
   * @param option
   */
  init(option?: any, runtime?: boolean);

  /**
   * 数据更新  此时要负责刷新整个图表区域
   * @param option
   */
  update(option: any);

  /**
   * 更新全局样式 目前只有Echart图表使用的到
   * @param {string} theme
   */
  updateTheme(theme: string);

  resize();

  // 图标进入交互状态
  activate();

  deactivate();

  destroy();
}
