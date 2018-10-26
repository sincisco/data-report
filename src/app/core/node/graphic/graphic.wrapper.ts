import {IGraphic, IGraphicOption} from '@core/node/graphic/graphic';
import {combineLatest, Observable, Subject, Subscription} from 'rxjs';
import {RegionController} from '@core/node/region/region.controller';
import {getParameterName, guid} from '@core/node/utils/tools';
import {graphicMap} from '@core/node/config/graphic.map';
import {GraphicConfigManager} from '@core/config/design/graphic.config.manager';
import {distinctUntilChanged, tap} from 'rxjs/operators';
import * as _ from 'lodash';
import {dataModelManager} from '@core/data/data.model.manager';
import {ChangedItem} from '@core/node/event/model.event';


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

  private _configSubject = new Subject();
  private _configSubscription: Subscription;
  private _modelSubscription: Subscription;

  private _optionAccessor: Function;

  constructor(private _region: RegionController) {
  }

  get uuid(): string {
    return this._uuid;
  }

  get $element() {
    return this._graphic.$element;
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
      this._graphic = new (graphicMap.get(graphicKey))();
      const paramNameArray = getParameterName(this._graphic.init), map = {
        region: this._region,
        wrapper: this
      };
      this._graphic.init(...paramNameArray.map((paramName) => {
        return map[paramName];
      }));
      this._region.addChild(this);
    }

    this._configSubscription = this._configSubject
      .pipe(distinctUntilChanged())
      .subscribe((model: Array<ChangedItem> | ChangedItem) => {
        if (_.isArray(model)) {
          this._graphicOption.configOption = Object.assign({}, model[0].option);
        } else if (!_.isNull(model)) {
          this._graphicOption.configOption = Object.assign({}, model.option);
        }
      });

    this._uuid = graphicId || guid(10, 16);

    // 有configOption一般粘贴，或者打开新的文件时 会走这条路
    if (configOption) {
      this._configSource = this._region.page
        .getMockConfigSource({
          graphicId: this._uuid,
          graphicKey,
          configOption
        });
    } else { // 如果是新建 则肯定是调用设计时的configFactory
      console.log(configOption, 'create 根据实际情况');
      this._configSource = this._region.page
        .getConfigSource({
          graphicId: this._uuid,
          graphicKey,
          configOption
        });
    }
    this._dataSource = this._region.page.getDataSource(dataOptionId);

    // 两个组件必须同时打开  不然收不到信息
    this._modelSubscription = this._graphic
      .accept(combineLatest(this._configSource, this._dataSource)
        .pipe(tap((modelArray: Array<any>) => {
          const [model, data] = modelArray;
          this._configSubject.next(model);
        })));
  }

  switchConfigSource() {
    if (this._modelSubscription) {
      this._modelSubscription.unsubscribe();
    }
    this._configSource = this._region.page.getConfigSource({
      graphicId: this._uuid,
      graphicKey: this._graphicOption.graphicKey,
      configOption: this._graphicOption.configOption
    });
    this._modelSubscription = this._graphic.accept(combineLatest(this._configSource, this._dataSource)
      .pipe(tap((modelArray: Array<any>) => {
        const [model, data] = modelArray;
        this._configSubject.next(model);
      })));
  }

  switchDataSource(dataOptionId: string) {
    this._graphicOption.dataOptionId = dataOptionId;
    if (this._modelSubscription) {
      this._modelSubscription.unsubscribe();
    }
    this._dataSource = this._region.page.getDataSource(dataOptionId);
    this._modelSubscription = this._graphic.accept(combineLatest(this._configSource, this._dataSource)
      .pipe(tap((modelArray: Array<any>) => {
        const [model, data] = modelArray;
        this._configSubject.next(model);
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

  get optionAccessor() {
    return this._optionAccessor || (() => Object.assign({}, this._graphicOption));
  }

  set optionAccessor(value: Function) {
    this._optionAccessor = value;
  }

  getOption() {
    return this.optionAccessor();
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
    if (this._configSubscription) {
      this._configSubscription.unsubscribe();
      this._configSubscription = null;
    }
    if (this._modelSubscription) {
      this._modelSubscription.unsubscribe();
      this._modelSubscription = null;
    }
    if (this._graphic) {
      this._graphic.destroy();
      this._graphic = null;
    }
  }
}
