import {IGraphic} from '@core/node/graphic/graphic';
import {Subscription} from 'rxjs';
import {RegionController} from '@core/node/region/region.controller';
import {guid} from '@core/node/utils/tools';

/**
 *
 * 管理组件的ConfigSource和DataSource
 */
export class GraphicWrapper {

  private _uuid: string;
  private _graphic: IGraphic;
  private _configSource;
  private _dataSource;

  private _subscription: Subscription;

  constructor(private _region: RegionController) {
    this._uuid = this._uuid = guid(10, 16);
  }

  init(option) {

    this._configSource = this._region.page.configSourceFactory.getConfigSource(option);

  }

  switchDataSource() {
  }

  // 激活配置面板
  activateConfig() {

  }

  getOption() {

  }

  /**
   * 更新全局样式 目前只有Echart图表使用的到
   * @param {string} theme
   */
  updateTheme(theme: string) {

  }


  resize() {

  }

  // 图标进入交互状态
  activate() {

  }

  deactivate() {

  }

  destroy() {

  }
}
