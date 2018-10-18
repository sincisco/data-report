import {ComponentRef} from '@angular/core';
import {RegionController} from '../../../region/region.controller';
import {IGraphic} from '../../graphic';
import {Chart} from '../../../graphic.view/chart/chart';

import {DesignGraphicConfig} from '../../../../source/config.source/design.config.source';

import * as moment from 'moment';
import {BarConfigComponent} from '../../../../../components/graphic.config/chart/bar.config.component';
import {session} from '@core/node/utils/session';

const template = `
<div class="time-chart-container" 
style='font-family: "Microsoft Yahei", Arial, sans-serif; 
font-size: 20px; color: rgb(255, 255, 255); font-weight: normal; justify-content:flex-start;'>
<img src="../../../../../../assets/images/templet/pic-4.png" style="margin-right: 15px;">
<span></span></div>
`;

export class Info1Graphic implements IGraphic {
  $element: JQuery;

  private _configComponentRef: ComponentRef<DesignGraphicConfig>;

  private _internal;

  get configSource() {
    return this._configComponentRef.instance;
  }

  /**
   * 1、初始化视图
   * 2、给视图绑定事件处理函数
   * 3、建立父子关系
   * @param {RegionController} region
   */
  constructor(region: RegionController) {
    this.$element = $(template);

    region.addChild(this);
  }

  init(option?: any) {
    this._configComponentRef = session.siderLeftComponent.forwardCreateGraphicConfig(BarConfigComponent);
    if (option) {
      this.configSource.importOption(option);
    }
    this.configSource.register('option', (key, oldValue, newValue) => {
      this.update(newValue);
    });

    this._internal = setInterval(() => {
      this.$element.find('span').text(Math.floor(Math.random() * 1000000));
    }, 1000);
  }

  getOption() {

  }

  addChild(chart: Chart) {
  }


  update(option: any) {

  }

  updateTheme(theme) {

  }

  updateGraphic(option: any) {

  }

  resize() {

  }

  activate() {

  }

  deactivate() {

  }

  activateConfig() {
    if (this._configComponentRef) {
      session.siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
    }
  }

  /**
   *
   */
  destroy() {
    this._configComponentRef.destroy();
    this._configComponentRef = null;
    if (this._internal) {
      clearInterval(this._internal);
      this._internal = null;
    }
  }
}
