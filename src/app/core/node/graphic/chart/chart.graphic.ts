import {ComponentRef, Type} from '@angular/core';
import {RegionController} from '../../region/region.controller';
import {IGraphic} from '../graphic';
import {Chart} from '../../graphic.view/chart/chart';

import {contextMenuHelper} from '../../../../utils/contextMenu';

import {DesignGraphicConfig} from '../../../source/config.source/design.config.source';
import {BarConfigComponent} from '../../../../components/graphic.config/chart/bar.config.component';
import {session} from '../../utils/session';
import {ModelSourceFactory} from '../../../model/model.source.factory';
import {guid} from '../../utils/tools';
import {ModelEventTarget, OuterModelEventTarget} from '../../event/model.event';
import {GraphicConfigManager} from '../../../config/design/graphic.config.manager';

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
  private _uuid: string;
  private readonly _$frame: JQuery;
  private readonly _$toolbar: JQuery;
  private _modelEventTarget = new OuterModelEventTarget();

  protected _chart: Chart;
  protected _configComponentRef: ComponentRef<DesignGraphicConfig>;

  get configSource() {
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

  abstract init(option?: any, runtime?: boolean);

  /**
   * 1、创建 GraphicView
   * 2、创建 ConfigSource
   * 3、监听 ConfigSource 变化
   * 4、导入数据（初始化）ConfigSource
   * @param {Type<DesignGraphicConfig>} graphicConfigClass
   * @param option
   * @private
   */
  protected _init(graphicConfigClass: Type<DesignGraphicConfig>, option?: any) {
    // 步骤1
    this._chart = new Chart(this);
    // 步骤二
    ModelSourceFactory.getInstance('design').getModelSource({
      configOption: {
        graphicId: this._uuid = guid(10, 16),
        graphicConfigClass,
        option
      },
      dataOption: 'easy'
    }).subscribe((aaa) => {
      this._modelEventTarget.trigger(aaa[0]);
      this.updateDate(aaa[1]);
      console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW', aaa);
    });
    // this._configComponentRef = session.siderLeftComponent.forwardCreateGraphicConfig(graphicConfigClass);
    // 步骤三
    this._modelEventTarget.register('option', (key, oldValue, newValue) => {
      console.log(key, oldValue, newValue);
      this.update(newValue);
    });
  }

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

  updateDate(data: any) {
    if (this._chart) {
      this._chart.updateData(data);
    }
  }

  updateTheme(theme) {
    if (this._chart) {
      this._chart.updateTheme(theme);
    }
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
    GraphicConfigManager.getInstance().activate(this._uuid);
    if (this._configComponentRef) {
      session.siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
    }
  }

  destroy() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;

      this._configComponentRef.destroy();
      this._configComponentRef = null;
    }
  }

  private _bindToolbarEvent() {
    this._$toolbar.on('click', ($event: JQuery.Event) => {
      contextMenuHelper.open([
        {
          displayName: '进入图表内操作'
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
