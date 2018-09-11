import {ComponentRef} from '@angular/core';
import {RegionController} from '../../region/region.controller';
import {IGraphic} from '../graphic';
import {Chart} from '../../graphic.view/chart/chart';

import {contextMenuHelper} from '../../../../utils/contextMenu';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';

import {GraphicConfig} from '../../../../components/graphic.config/graphic.config';

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
  protected _configComponentRef: ComponentRef<GraphicConfig>;

  get model() {
    return this._configComponentRef.instance;
  }

  /**
   * 1、初始化视图
   * 2、给视图绑定事件处理函数
   * 3、建立父子关系
   * @param {RegionController} region
   */
  protected constructor(region: RegionController) {
    this.$element = $(template);

    this._$frame = this.$element.find('.frame');
    this._$toolbar = this.$element.find('.m-graphic-toolbar');

    region.addChild(this);

    this._bindToolbarEvent();
  }

  abstract init(option?: any);

  abstract getOption();

  addChild(chart: Chart) {
    this._chart = chart;
    this._$frame.append(chart.$element);
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
    if (this._configComponentRef) {
      siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
    }
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
