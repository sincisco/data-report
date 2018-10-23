import {IGraphic, IGraphicOption} from '@core/node/graphic/graphic';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {RegionController} from '@core/node/region/region.controller';
import {getParameterName, guid} from '@core/node/utils/tools';
import {graphicMap} from '@core/node/config/graphic.map';
import {GraphicConfigManager} from '@core/config/design/graphic.config.manager';
import {tap} from 'rxjs/operators';


/**
 *
 * 管理组件的ConfigSource和DataSource
 */
export class GraphicWrapper {

  private _uuid: string;
  private _graphicOption: IGraphicOption;

  private _graphic: IGraphic;
  private _configSource: Observable<any>;
  private _dataSource: Observable<any>;

  private _subscription: Subscription;

  constructor(private _region: RegionController) {
  }

  /**
   * 创建Graphic
   *  $element属性可用
   * 创建ConfigSource
   * 创建DataSource
   * @param graphicOption
   */
  init(graphicOption: IGraphicOption) {
    this._graphicOption = graphicOption;
    console.log(graphicOption);
    const {graphicId, graphicKey, dataOptionId, configOption} = graphicOption;
    if (graphicMap.has(graphicKey)) {
      const _graphicClass = graphicMap.get(graphicKey);
      this._graphic = new _graphicClass();
      const paramNameArray = getParameterName(this._graphic.init), map = {
        region: this._region,
        wrapper: this
      };
      console.log(paramNameArray);
      this._graphic.init(...paramNameArray.map((paramName) => {
        return map[paramName];
      }));
      this._region.addChild(this);
    }

    this._uuid = graphicId || guid(10, 16);

    if (configOption) {
      console.log('create mock');
      this._configSource = this._region.page.configSourceManager
        .getMockConfigSource({
          graphicId: this._uuid,
          graphicKey,
          configOption
        });
    } else {
      console.log('create 根据实际情况');
      this._configSource = this._region.page.configSourceManager
        .getConfigSource({
          graphicId: this._uuid,
          graphicKey,
          configOption
        });
    }
    this._dataSource = this._region.page.dataSourceManager.getDataSourceByID(dataOptionId);

    // 两个组件必须同时打开  不然收不到信息
    this._subscription = this._graphic.accept(combineLatest(this._configSource, this._dataSource)
      .pipe(tap((modelArray: Array<any>) => console.log('tap'))));
  }

  switchConfigSource() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    this._configSource = this._region.page.configSourceManager.getConfigSource({
      graphicId: this._uuid,
      graphicKey: this._graphicOption.graphicKey,
      configOption: this._graphicOption.configOption
    });
    this._subscription = this._graphic.accept(combineLatest(this._configSource, this._dataSource)
      .pipe(tap((modelArray: Array<any>) => console.log('tap'))));
  }

  switchDataSource(dataOptionId: string) {
    this._graphicOption.dataOptionId = dataOptionId;
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    this._dataSource = this._region.page.dataSourceManager.getDataSourceByID(dataOptionId);
    this._subscription = this._graphic.accept(combineLatest(this._configSource, this._dataSource)
      .pipe(tap((modelArray: Array<any>) => console.log('tap'))));
  }

  // 激活配置面板
  activateConfig() {
    if (!GraphicConfigManager.getInstance().has(this._uuid)) {
      this.switchConfigSource();
    }
    GraphicConfigManager.getInstance().activate(this._uuid);
  }

  getOption() {
    return Object.assign({}, this._graphicOption);
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
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }
}
