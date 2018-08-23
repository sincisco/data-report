import {ComponentRef, Type} from '@angular/core';
import {Region} from '../../region/region';
import {IGraphic} from '../graphic';
import {Chart} from '../../content/chart/chart';

import {ConfigModel} from '../../../../layout/sider/graphic.config/graphic.config';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';

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

export abstract class ChartGraphic implements IGraphic {
  $element: JQuery;
  private readonly _$frame: JQuery;
  private readonly _$toolbar: JQuery;

  protected _chart: Chart;
  protected _configComponentRef: ComponentRef<ConfigModel>;

  /**
   * 1、初始化视图
   * 2、给视图绑定事件处理函数
   * 3、建立父子关系
   * @param {Region} region
   */
  protected constructor(region: Region) {
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');
    this._$toolbar = this.$element.find('.m-graphic-toolbar');
    this._bindToolbarEvent();

    region.addChild(this);
  }

  addChild(chart: Chart) {
    this._chart = chart;
    this._$frame.append(chart.$element);
  }

  abstract init(option?: any);

  load(option?: any) {
    option = _.defaultsDeep(option || {}, this._configComponentRef.instance.option);
    this._chart.init(option);
  }

  update(option: any) {
    if (this._chart) {
      this._chart.update(option);
    }
  }

  updateTheme(theme) {
    if (this._chart) {
      this._chart.updateTheme(theme);
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
    if (this._chart) {
      this._chart.activate();
    }
  }

  deactivate() {
    if (this._chart) {
      this._chart.deactivate();
    }
  }

  activateConfig() {
    if (!this._configComponentRef) {
      this._configComponentRef = siderLeftComponent.createGraphicConfig(this._chart.configClass);
      this._configComponentRef.instance.graphic = this;
    } else {
      siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
    }
  }

  abstract derender();

  getOption() {
    if (this._chart) {
      return this._chart.getOption();
    }
  }

  render(option: any) {

  }

  /**
   *
   */
  destroy() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;

      this._configComponentRef.destroy();
      this._configComponentRef = null;
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
