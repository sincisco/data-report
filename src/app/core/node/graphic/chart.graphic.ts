import {ComponentRef, Type} from '@angular/core';
import {Region} from '../region/region';
import {IGraphic} from './graphic';
import {Chart} from '../content/chart/chart';

import {GraphicConfig} from '../../../layout/sider/graphic.config/graphic.config';
import {contextMenuHelper} from '../../../utils/contextMenu';
import {siderLeftComponent} from '../../../layout/sider/sider.left.component';

import * as _ from 'lodash';

const template = `
<div class="graphic m-graphic m-graphic-auto z-mode-edit">
  <div class="frame"
       style="border: 0px solid rgb(204, 204, 204); background-color: rgba(255, 255, 255, 0.2); border-radius: 0px; opacity: 1;">
  </div>
  <div class="m-graphic-toolbar">
    <ul class="more">
      <li><i class="u-icn u-icn-toolbar-more" style="color: rgb(51, 51, 51);"></i></li>
    </ul>
  </div>
</div>
`;

export class ChartGraphic implements IGraphic {
  $element: JQuery;
  private _$frame: JQuery;
  private _$toolbar: JQuery;

  private _region: Region;
  private _chart: Chart;
  private _configComponentRef: ComponentRef<GraphicConfig>;

  constructor(region: Region) {
    this._region = region;
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');
    this._$toolbar = this.$element.find('.m-graphic-toolbar');
    region.addChild(this);
  }

  childHost(): JQuery {
    return this._$frame;
  }

  init(contentClass: Type<Chart>) {
    this._chart = new contentClass(this);
    this._bindToolbarEvent();
    console.log(this._chart);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(this._chart.configClass);
    this._configComponentRef.instance.graphic = this;
  }

  load(option?: any) {
    option = _.defaultsDeep(option || {}, this._configComponentRef.instance.option);
    this._chart.init(option);
  }

  update(option: any, theme?: string) {
    if (this._chart) {
      this._chart.update(option, theme);
    }
  }

  updateGraphic(option: any) {

  }

  resize() {
    if (this._chart) {
      this._chart.resize();
    }
  }

  activate() {
    if (!this._configComponentRef) {
      this._configComponentRef = siderLeftComponent.createGraphicConfig(this._chart.configClass);
      this._configComponentRef.instance.graphic = this;
    } else {
      siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
    }
    if (this._chart) {
      this._chart.activate();
    }
  }

  destroy() {
    if (this._chart) {
      this._chart.destroy();
      this._configComponentRef.destroy();
    }
  }

  private _bindToolbarEvent() {
    this._$toolbar.click(($event: JQuery.Event) => {
      contextMenuHelper.open([
        {
          displayName: '进入图表内操作',
          callback: () => {
            console.log('进入图表内操作');
          }
        },
        {
          displayName: '导出',
          children: [
            {
              displayName: '导出图片'
            },
            {
              displayName: '导出excel'
            },
            {
              displayName: '导出PDF'
            }
          ]
        },
        {
          displayName: '查看数据'
        },
        {
          displayName: '设置度量预警'
        },
        {
          displayName: '创建图表联动'
        },
        {
          displayName: '数据权限设置'
        },
        {
          displayName: '定时刷新'
        }
      ], $event.pageX, $event.pageY, $event);
      return false;
    });
  }
}
