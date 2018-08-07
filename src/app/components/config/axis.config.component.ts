import {
  AfterViewInit,
  Component, EventEmitter, Input,
  KeyValueDiffer,
  KeyValueDiffers, NgZone,
  OnInit, Output, TemplateRef,
  ViewChild,
} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Axis} from '../../node/content/chart/echart.interface/axis';

import {NzModalFilterComponent} from '../../layout/sider/property.data/common/filter.modal.component';
import {NzModalService} from 'ng-zorro-antd';
import {Dimension} from '@core/dataset/dataset.interface';

import {draggableHeler} from '../../utils/draggable.helper';
import {contextMenuHelper} from '../../utils/contextMenu';
import {reportGlobal} from '../../node/region/region';

@Component({
  selector: 'app-axis-config',
  templateUrl: './axis.config.component.html',
  styleUrls: ['./axis.config.component.less']
})
export class AxisConfigComponent implements AfterViewInit, OnInit {


  @ViewChild(NgForm) ngForm: NgForm;
  @ViewChild('modalTitle') tplTitle: TemplateRef<any>;

  @Input() axis: Axis = {};
  @Input() series: Array<Dimension> = [];
  @Input() name: string;

  @Output() axisChange = new EventEmitter();


  private _differ: KeyValueDiffer<any, any>;
  private _filterArray: Array<any> = [];

  constructor(private _differs: KeyValueDiffers,
              private _modalService: NzModalService,
              private _zone: NgZone) {
  }

  dragenter(event: DragEvent) {
    event.dataTransfer.dropEffect = 'move';
    // 阻止浏览器默认事件
    event.preventDefault();
  }

  /**
   * 在其它的事件(如ondragover、ondragleave等），是无法获取dataTransfer里面的值了。
   * 这是由于W3C要求对dataTransfer里的值进行保护[参考]。
   * 因此，如果需要在这些事件里获取数据，只能通过一个全局变量等其它方式来实现了。
   * @param {DragEvent} event
   */
  dragover(event: DragEvent) {
    // 阻止浏览器默认事件
    event.preventDefault();
  }

  drop(event: DragEvent) {
    // 火狐中取消drop默认行为，阻止打开URL
    event.preventDefault();

    this.series.push(draggableHeler.dragInfo);
    this.axisChange.emit(this.series);
  }

  axisClick($event: MouseEvent) {
    contextMenuHelper.open([
      {
        displayName: '修改显示名称',
        callback: () => {
          console.log('复制');
        }
      }, {
        displayName: '筛选器',
        icon: 'u-icn-filter',
        callback: () => {
          this.createComponentModal((<HTMLElement>$event.target).getAttribute('fieldName'));
          contextMenuHelper.close();
        }
      }, {
        displayName: '设置数轴',
        icon: 'u-icn-axis'
      }, {
        displayName: '编辑总计'
      }, {
        displayName: '取消总计'
      }, 'split', {
        displayName: '排序',
        icon: 'u-icn-sort-amount-asc'
      }, {
        displayName: '设置跳转',
        children: [
          {
            displayName: '设置跳转报告页'
          }, {
            displayName: '设置跳转报表'
          }, {
            displayName: '设置跳转链接'
          }
        ]
      }, 'split', {
        displayName: '移除',
        icon: 'u-icn-delete',
        callback: () => {
          this.series = null;
        }
      }
    ], $event.pageX, $event.pageY, $event, true);
  }

  createComponentModal(fieldName?: string): void {
    console.log('fieldName', fieldName);
    const modal = this._modalService.create({
      nzTitle: this.tplTitle,
      nzContent: NzModalFilterComponent,
      nzWidth: '870px',
      nzWrapClassName: 'filter-window',
      nzComponentParams: {
        title: 'title in component',
        subtitle: 'component sub title，will be changed after 2 sec',
        fieldName: fieldName
      },
      nzOnOk: (data) => {
        console.log(data);

        this._filterArray = [{
          name: 'listFilter',
          config: {
            fieldName: fieldName,
            list: data.goodList
          }
        }];

        // this._updateSeries();
      }
      // nzFooter: [{
      //   label: 'change component tilte from outside',
      //   onClick: (componentInstance) => {
      //     componentInstance.title = 'title in inner component is changed';
      //   }
      // }]
    });

    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));

    // Return a result when closed
    modal.afterClose.subscribe((result) => console.log('[afterClose] The result is:', result));

    // delay until modal instance created
    window.setTimeout(() => {
      const instance = modal.getContentComponent();
      instance.subtitle = 'sub title is changed';
    }, 2000);
  }

  ngOnInit() {
    console.log('**************************');
    console.log(JSON.stringify(this.axis));
    this._differ = this._differs.find(this.axis).create();
  }

  ngAfterViewInit() {
    this.ngForm.valueChanges.subscribe((value) => {
      const changes = this._differ.diff(value);
      if (changes) {
        console.log('AxisConfigComponent valueChanges');
        console.log(value);
        this.axisChange.emit();
      }

    });
  }

}
