import {IGraphic, IGraphicOption} from '@core/node/graphic/graphic';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {RegionController} from '@core/node/region/region.controller';
import {getParameterName, guid} from '@core/node/utils/tools';
import {graphicMap} from '@core/node/config/graphic.map';
import {GraphicConfigManager} from '@core/config/design/graphic.config.manager';
import {tap} from 'rxjs/operators';
import * as _ from 'lodash';
import {dataModelManager} from '@core/data/data.model.manager';


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
      console.log(configOption, 'create mock');
      this._configSource = this._region.page
        .getMockConfigSource({
          graphicId: this._uuid,
          graphicKey,
          configOption
        });
    } else {
      console.log(configOption, 'create 根据实际情况');
      this._configSource = this._region.page
        .getConfigSource({
          graphicId: this._uuid,
          graphicKey,
          configOption
        });
    }
    this._dataSource = this._region.page.getDataSource(dataOptionId);

    let lastModel;
    // 两个组件必须同时打开  不然收不到信息
    this._subscription = this._graphic.accept(combineLatest(this._configSource, this._dataSource)
      .pipe(tap((modelArray: Array<any>) => {
        const [model, data] = modelArray;
        if (_.isArray(model)) {
          this._graphicOption.configOption = Object.assign({}, model[0].option);
        } else if (!_.isNull(model)) {
          console.log(this._uuid + '!!!!!!!!!!!!!!!!!!!!!!!!!!!!', model.option);
          if (lastModel !== model.option) {
            console.log('model changed');
            this._graphicOption.configOption = Object.assign({}, model.option);
            lastModel = model.option;
          }

        }
      })));
  }

  switchConfigSource() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    this._configSource = this._region.page.getConfigSource({
      graphicId: this._uuid,
      graphicKey: this._graphicOption.graphicKey,
      configOption: this._graphicOption.configOption
    });
    let lastModel;
    this._subscription = this._graphic.accept(combineLatest(this._configSource, this._dataSource)
      .pipe(tap((modelArray: Array<any>) => {
        const [model, data] = modelArray;
        if (_.isArray(model)) {
          this._graphicOption.configOption = Object.assign({}, model[0].option);
        } else {
          console.log(this._uuid + '********************', model.option);
          if (lastModel !== model.option) {
            console.log('model changed');
            this._graphicOption.configOption = Object.assign({}, model.option);
            lastModel = model.option;
          }

        }
      })));
  }

  switchDataSource(dataOptionId: string) {
    this._graphicOption.dataOptionId = dataOptionId;
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    this._dataSource = this._region.page.getDataSource(dataOptionId);
    let lastModel;
    console.log(this._dataSource);
    this._dataSource.subscribe(() => {
      console.log('hahahah');
    });
    this._subscription = this._graphic.accept(combineLatest(this._configSource, this._dataSource)
      .pipe(tap((modelArray: Array<any>) => {
        console.log('tab');
        const [model, data] = modelArray;
        if (_.isArray(model)) {
          this._graphicOption.configOption = Object.assign({}, model[0].option);
        } else {
          console.log(this._uuid + '********************', model.option);
          if (lastModel !== model.option) {
            console.log('model changed');
            this._graphicOption.configOption = Object.assign({}, model.option);
            lastModel = model.option;
          }

        }
      })));
  }

  // 激活配置面板
  activateConfig() {
    this._region.page.focusRegion = this._region;

    dataModelManager.switchDataModel(this._graphicOption.dataOptionId, false);
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
