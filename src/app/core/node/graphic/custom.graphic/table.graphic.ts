import {ComponentRef} from '@angular/core';
import {RegionController} from '../../region/region.controller';
import {IGraphic} from '../graphic';
import {Chart} from '../../graphic.view/chart/chart';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';

import {GraphicConfig} from '../../../../components/graphic.config/graphic.config';

import {BarConfigComponent} from '../../../../components/graphic.config/chart/bar.config.component';

const template = `<div class="demo">
<table class="bordered">
  <thead></thead>
  <tbody></tbody>
</table>
</div>`;

export class TableGraphic implements IGraphic {
  $element: JQuery;

  private _configComponentRef: ComponentRef<GraphicConfig>;

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

    this.$element.find('thead').html(this._generateHead(['学校', '院士人数', '综合排名']));
    this.$element.find('tbody').html(this._generateBody(['学校', '院士人数', '综合排名'],
      [
        {'学校': '北京大学', '院士人数': '100', '综合排名': '2'},
        {'学校': '清华大学', '院士人数': '120', '综合排名': '1'},
        {'学校': '南京大学', '院士人数': '30', '综合排名': '7'},
        {'学校': '上海交通大学', '院士人数': '30', '综合排名': '6'},
        {'学校': '复旦大学', '院士人数': '20', '综合排名': '5'},
        {'学校': '浙江大学', '院士人数': '45', '综合排名': '3'},
      ]));

  }

  private _generateHead(meta: Array<string>) {
    return `<tr>${meta.map((key) => {
      return `<th>${key}</th>`;
    }).join('')}</tr>`;
  }

  private _generateBody(meta: Array<string>, rows: Array<any>) {
    return rows.map((value, index, array) => {
      return `<tr>${meta.map((key) => {
        return `<td>${value[key]}</td>`;
      }).join('')}</tr>`;
    }).join('');
  }

  getOption() {
    return {
      graphicClass: 'table.graphic',
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
  }
}
