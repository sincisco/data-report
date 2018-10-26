import {Type} from '@angular/core';
import {Observable} from 'rxjs';
import * as _ from 'lodash';
import {RegionController} from '../../region/region.controller';
import {IGraphic} from '../graphic';
import {Chart} from '../../graphic.view/chart/chart';

import {contextMenuHelper} from '../../../../utils/contextMenu';

import {DesignGraphicConfig} from '../../../source/config.source/design.config.source';
import {OuterModelEventTarget} from '../../event/model.event';


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
  private _$frame: JQuery;
  private _$toolbar: JQuery;
  protected _modelEventTarget = new OuterModelEventTarget();

  protected _chart: Chart;

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

    this._bindToolbarEvent();
  }


  /**
   * 1、创建 GraphicView
   * 2、创建 ConfigSource
   * 3、监听 ConfigSource 变化
   * 4、导入数据（初始化）ConfigSource
   * @param {Type<DesignGraphicConfig>} graphicConfigClass
   * @param option
   * @private
   */
  init(...params: Array<any>) {
    // 步骤1
    this._chart = new Chart(this);
    this._$frame.append(this._chart.$element);

    this._modelEventTarget.register('option', (key, oldValue, newValue) => {
      this.update(newValue);
    });
  }

  accept(model: Observable<any>) {
    let lastConfig, lastData;
    return model.subscribe((modelArray: Array<any>) => {
      console.log('model change');
      const [config, data] = modelArray;
      if (!!config && config !== lastConfig) {
        console.log('config change', JSON.stringify(config));
        if (_.isArray(config)) {
          this._modelEventTarget.batchTrigger(config);
        } else {
          this._modelEventTarget.trigger(config);
        }
        this.updateDate(data);
        lastConfig = config;
      }

      if (data !== lastData) {
        console.log('data change', JSON.stringify(data));
        this.updateDate(data);
        lastData = data;
      }
      console.log(config, data);
    });
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

  destroy() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
    if (this._modelEventTarget) {
      this._modelEventTarget.destroy();
    }
    if (this._$toolbar) {
      this._$toolbar.off('click');
      this._$toolbar = null;
    }
    this._$frame = null;
    if (this.$element) {
      this.$element.remove();
      this.$element = null;
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
