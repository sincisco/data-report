import {IGraphic, IGraphicOption} from '@core/node/graphic/graphic';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {RegionController} from '@core/node/region/region.controller';
import {guid} from '@core/node/utils/tools';
import {graphicMap} from '@core/node/config/graphic.map';


/**
 *
 * 管理组件的ConfigSource和DataSource
 */
export class GraphicWrapper {

  private _uuid: string;
  private _graphic: IGraphic;
  private _configSource: Observable<any>;
  private _dataSource: Observable<any>;

  private _subscription: Subscription;

  constructor(private _region: RegionController) {
    this._uuid = this._uuid = guid(10, 16);
  }

  /**
   * 创建Graphic
   *  $element属性可用
   * 创建ConfigSource
   * 创建DataSource
   * @param option
   */
  init(option: IGraphicOption) {
    const {graphicClass, configSourceOption, dataOptionId} = option;
    if (graphicMap.has(graphicClass)) {
      const _graphicClass = graphicMap.get(graphicClass);
      this._graphic = new _graphicClass();
      this._graphic.init();
      this._region.addChild(this);
    }
    this._configSource = this._region.page.configSourceManager.getConfigSource(configSourceOption);
    this._dataSource = this._region.page.dataSourceManager.getDataSourceByID(dataOptionId);

    this._graphic.accept(combineLatest(this._configSource, this._dataSource));
  }

  switchDataSource(dataOptionID: string) {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    this._dataSource = this._region.page.dataSourceManager.getDataSourceByID(dataOptionID);
    this._subscription = this._graphic.accept(combineLatest(this._configSource, this._dataSource));
  }

  // 激活配置面板
  activateConfig() {

  }

  getOption() {

  }

  get $element() {
    return this._graphic.$element;
  }

  /**
   * 更新全局样式 目前只有Echart图表使用的到
   * @param {string} theme
   */
  updateTheme(theme: string) {
    if (this._graphic) {
      this._graphic.updateTheme(theme);
    }
  }


  resize() {
    if (this._graphic) {
      this._graphic.resize();
    }
  }

  // 图标进入交互状态
  activate() {
    if (this._graphic) {
      this._graphic.activate();
    }
  }

  deactivate() {
    if (this._graphic) {
      this._graphic.deactivate();
    }
  }

  destroy() {

  }
}
