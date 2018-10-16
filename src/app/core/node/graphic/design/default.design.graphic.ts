import {DesignGraphicConfig} from '../../source/config.source/design.config.source';
import {DataSource} from '../../source/data.source/data.source';
import {IGraphic} from '../graphic';
import {IGraphicView} from '@core/node/graphic.view/graphic.view';
import {ComponentRef} from '@angular/core';
import {GraphicConfig} from '@core/node/source/config.source/graphic.config';
import {session} from '@core/node/utils/session';

export abstract class DefaultDesignGraphic implements IGraphic {
  $element: JQuery;

  protected _view: IGraphicView;
  protected _configComponentRef: ComponentRef<DesignGraphicConfig>;

  protected constructor(protected _graphicClass: string){

  }

  get configSource(): GraphicConfig {
    return this._configComponentRef.instance;
  }

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
   * 更新全局样式 目前只有Echart图表使用的到
   * @param {string} theme
   */
  updateTheme(theme: string) {
  }

  getOption() {
    return {
      graphicClass: this._graphicClass,
      option: this.configSource.exportOption()
    };
  }

  resize() {
    if (this._view) {
      this._view.resize();
    }
  }

  activate() {
    if (this._view) {
      this._view.activate();
    }
  }

  deactivate() {
    if (this._view) {
      this._view.deactivate();
    }
  }

  activateConfig() {
    if (this._configComponentRef) {
      session.siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
    }
  }

  destroy() {
    if (this._view) {
      this._view.destroy();
      this._view = null;
      this._configComponentRef.destroy();
      this._configComponentRef = null;
    }
    this.$element.remove();
    this.$element = null;
  }
}

