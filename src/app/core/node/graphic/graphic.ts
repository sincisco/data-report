import {GraphicConfig} from '@core/source/config.source/graphic.config';

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

  // 激活配置面板
  activateConfig();

  /**
   * 更新全局样式 目前只有Echart图表使用的到
   * @param {string} theme
   */
  updateTheme(theme: string);

  getOption();

  resize();

  // 图标进入交互状态
  activate();

  deactivate();

  destroy();
}

