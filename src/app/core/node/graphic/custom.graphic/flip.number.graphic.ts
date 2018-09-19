import {ComponentRef} from '@angular/core';
import {RegionController} from '../../region/region.controller';
import {IGraphic} from '../graphic';
import {Chart} from '../../graphic.view/chart/chart';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';

import {GraphicConfig} from '../../../../components/graphic.config/graphic.config';

import {BarConfigComponent} from '../../../../components/graphic.config/chart/bar.config.component';
import * as _ from 'lodash';

const template = `
<div class="flip-number-warpper" style="justify-content: center;">
  <div class="flip-number" style="flex-direction: row;">
    <div class="flip-number-prefix"
         style="font-family: 'Microsoft Yahei'; font-size: 14px; color: rgb(115, 170, 229); 
         align-self: flex-end; margin-right: 0px; margin-bottom: 0px;"></div>
    <div class="flip-number-number" style="align-self: right;">
      <div class="flip-single-number">
        1
      </div>
      <div class="flip-single-number">
        0
      </div>
      <div class="flip-single-number">
        ,
      </div>
      <div class="flip-single-number">
        0
      </div>
      <div class="flip-single-number">
        0
      </div>
      <div class="flip-single-number">
        1
      </div>
      <div class="flip-single-number">
        ,
      </div>
      <div class="flip-single-number">
        7
      </div>
      <div class="flip-single-number">
        2
      </div>
      <div class="flip-single-number">
        2
      </div>
    </div>
    <div class="flip-number-suffix"
         style="font-family: 'Microsoft Yahei'; font-size: 20px; color: rgb(115, 170, 229); 
         align-self: flex-end; margin-left: 7px; margin-top: 0px;">
      元
    </div>
  </div>
</div>
`;

export class FlipNumberGraphic implements IGraphic {
  $element: JQuery;

  private _configComponentRef: ComponentRef<GraphicConfig>;

  private _internal;

  get model() {
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
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(BarConfigComponent);
    if (option) {
      this.model.importOption(option);
    }
    this.model.register('option', (key, oldValue, newValue) => {
      this.update(newValue);
    });

    this._internal = setInterval(() => {
      console.log(this._generateDom(Math.floor(Math.random() * 10000000)));
      // this.$element.find('span').text(Math.floor(Math.random() * 1000000));
    }, 1000);
  }

  private _generateDom(num: Number) {
    const numArray = this._handle(num);
    this.$element.find('.flip-number-number').html(numArray.map((value, index, array) => {
      if (value === ',') {
        return `<div class="flip-single-number only-comma">,</div>`;
      } else {
        return `<div class="flip-single-number only-number">${value}</div>`;
      }
    }).join(' '));
  }

  private _handle(num: Number) {
    console.log(num);
    const numArray = _.toArray(num + '');
    const aa = _.chunk(numArray.reverse(), 3);
    aa.forEach((value, index, array) => {
      if (index < array.length - 1) {
        value.push(',');
      }
    });
    return _.flatten(aa).reverse();
  }

  getOption() {
    return {
      graphicClass: 'flip.number.graphic',
      option: this.model.exportOption()
    };
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
      siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
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
