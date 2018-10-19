import {ComponentRef} from '@angular/core';
import {RegionController} from '../../region/region.controller';
import {IGraphic} from '../graphic';
import {Chart} from '../../graphic.view/chart/chart';

import {DesignGraphicConfig} from '../../../source/config.source/design.config.source';

import {BarConfigComponent} from '../../../../components/graphic.config/chart/bar.config.component';
import {TableDataSubject} from '../../../source/data.source/mock/table.data.subject';
import {session} from '../../utils/session';

const template = `
<div class="demo">
  <table class="bordered">
    <thead></thead>
    <tbody></tbody>
  </table>
</div>`;

export class TableGraphic implements IGraphic {
  $element: JQuery;

  private _configComponentRef: ComponentRef<DesignGraphicConfig>;

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

    new TableDataSubject().register((data: any) => {
      if (data) {
        this.$element.find('thead').html(this._generateHead(data.dimensions));
        this.$element.find('tbody').html(this._generateBody(data.dimensions, data.source));
      }
    });

  }

  private _generateHead(meta: Array<any>) {
    return `<tr>${meta.map((fieldDef) => {
      return `<th>${fieldDef.name}</th>`;
    }).join('')}</tr>`;
  }

  private _generateBody(meta: Array<any>, rows: Array<any>) {
    return rows.map((value, index, array) => {
      return `<tr>${meta.map((fieldDef) => {
        return `<td>${value[fieldDef.name]}</td>`;
      }).join('')}</tr>`;
    }).join('');
  }

  getOption() {
    return {
      graphicClass: 'table.graphic',
      option: this.configSource.exportOption()
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
      session.siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
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
