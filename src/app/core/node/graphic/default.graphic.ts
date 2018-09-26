import {DesignerConfigSource} from '../source/config.source/designer.config.source';
import {ConfigSource} from '@core/node/source/config.source/config.source';
import {DataSource} from '@core/node/source/data.source/data.source';
import {IGraphic} from '@core/node/graphic/graphic';

export abstract class DefaultGraphic implements IGraphic {
  $element: JQuery;

  configSource: DesignerConfigSource;

  get dataSource(): DataSource {
    return null;
  }

  abstract addChild(child);

  /**
   * 一般用于初始化  新建Graphic的时候调用
   * 如果有content的，则创建相应的content；负责配置面板的创建
   * @param option
   */
  abstract init(option?: any, runtime?: boolean);

  /**
   * 数据更新  此时要负责刷新整个图表区域
   * @param option
   */
  abstract update(option: any);

  /**
   * 更新全局样式 目前只有Echart图表使用的到
   * @param {string} theme
   */
  abstract updateTheme(theme: string);

  abstract getOption();

  abstract resize();

  // 图标进入交互状态
  abstract activate();

  abstract deactivate();

  // 激活配置面板
  abstract activateConfig();

  abstract destroy();
}

