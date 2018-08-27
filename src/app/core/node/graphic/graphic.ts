import {ConfigModel} from '../../../components/graphic.config/graphic.config';

export interface IGraphic {
  $element: JQuery;

  configModel: ConfigModel;

  /**
   * 一般用于初始化  新建Graphic的时候调用
   * 如果有content的，则创建相应的content；负责配置面板的创建
   * @param option
   */
  init(option?: any);

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

  /**
   * 这和方法可能要抛弃  统一在update方法中处理
   * @param option
   */
  updateGraphic(option: any);

  getOption();

  resize();

  // 图标进入交互状态
  activate();

  deactivate();

  // 激活配置面板
  activateConfig();

  destroy();
}

export interface IGraphicView {

}

export interface IGraphicModel {

}

