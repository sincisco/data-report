import {Region} from '../region/region';
import {Type} from '@angular/core';
import {IGraphic} from './graphic';
import {contextMenuHelper} from '../../utils/contextMenu';

const template = `
<div class="graphic m-graphic m-graphic-auto z-mode-edit">
  <div class="frame"
       style="border: 0px solid rgb(204, 204, 204); background-color: rgb(255, 255, 255); border-radius: 0px; opacity: 1;">
  </div>
  <div class="m-graphic-toolbar">
    <ul class="more">
      <li><i class="u-icn u-icn-toolbar-more" style="color: rgb(51, 51, 51);"></i></li>
    </ul>
  </div>
</div>
`;

export class GraphicChart implements IGraphic {
  $element: JQuery;
  private _$frame: JQuery;
  private _$toolbar: JQuery;
  private _content: IContent;

  constructor(region: Region) {
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');
    this._$toolbar = this.$element.find('.m-graphic-toolbar');
    region.$fill.append(this.$element);
  }

  init(contentClass: Type<IContent>) {
    const chart = this._content = new contentClass(this._$frame[0]);
    chart.init({});
    this._bindToolbarEvent();
  }

  activate() {
    if (this._content) {
      this._content.activate();
    }
  }

  resize() {
    if (this._content) {
      this._content.resize();
    }
  }

  update(option: any) {
    if (this._content) {
      this._content.update(option);
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
