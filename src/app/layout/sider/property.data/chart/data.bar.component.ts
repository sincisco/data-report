import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IDataComponent} from '../html/header.component';
import {ChartBarItem} from '../../../../node/content/chart/interface';
import {draggableHeler} from '../../../../utils/draggable.helper';
import {ChartBarNode, ChartBarOption} from '../../../../node/content/chart/chart.bar';
import {datasetManager} from '@core/dataset/dataset.manager';
import {HtmlParagraph} from '../../../../node/content/html/paragraph.html';
import {HeaderHtml} from '../../../../node/content/html/header.html';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {TextContent} from '../../../../node/content/text.content';
import {HtmlImage} from '../../../../node/content/html/image.html';
import {CommentContent} from '../../../../node/content/comment.content';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import {NzModalFilterComponent} from '../common/filter.modal.component';
import {filterExecutor} from '@core/filter/filter.executor';

@Component({
  selector: 'app-data-bar',
  templateUrl: './data.bar.component.html',
  styleUrls: ['./data.bar.component.less']
})
export class DataBarComponent implements AfterViewInit, OnInit, IDataComponent {

  @ViewChild(NgForm) ngForm: NgForm;
  @ViewChild('modalTitle') tplTitle: TemplateRef<any>;
  @Output() output = new EventEmitter();

  option: ChartBarOption = {
    xAxis: {
      name: 'xAxis1',
      axisLabel: {
        rotate: 90
      },
      axisTick: {
        interval: 5
      }
    },
    series: [
      {
        type: 'bar',
        name: 'test1',
        encode: {
          x: 'product',
          y: 1
        }
      }
    ]
  };

  seriesX: any;
  seriesY: Array<any> = [];

  filterArray: Array<any> = [];

  angle: string;
  private _differ: KeyValueDiffer<any, any>;

  constructor(private modalService: NzModalService, private _differs: KeyValueDiffers) {
  }

  ngModelChange() {
    console.log('123');
  }

  aa = 'top';

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
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

  dropX(event: DragEvent) {
    event.preventDefault();
    const data = event.dataTransfer.getData('Text');
    console.log(data);

    this.seriesX = draggableHeler.dragInfo;
  }

  dropY(event: DragEvent) {
    // 火狐中取消drop默认行为，阻止打开URL
    event.preventDefault();

    console.log(JSON.stringify(draggableHeler.dragInfo));
    this.seriesY.push(draggableHeler.dragInfo);
    this.seriesX && this._updateSeries();
  }


  private _updateSeries() {
    this.option.series = [];
    this.option.dataset = Object.assign({},
      datasetManager.current,
      {source: filterExecutor.execute(datasetManager.current.source, this.filterArray)});
    this.seriesY.forEach((value, index) => {
      this.option.series.push({
        type: 'bar',
        name: 'test' + index,
        encode: {
          x: this.seriesX.name,
          y: value.name
        }
      });
    });
    this.output.emit(this.option);
  }

  xAxisClick($event: MouseEvent) {
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
          this.seriesX = null;
        }
      }
    ], $event.pageX, $event.pageY, $event, true);
  }


  createComponentModal(fieldName?: string): void {
    console.log('fieldName', fieldName);
    const modal = this.modalService.create({
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

        this.filterArray = [{
          name: 'listFilter',
          config: {
            fieldName: fieldName,
            list: data.goodList
          }
        }];

        this._updateSeries();
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


  ngAfterViewInit() {
    this.ngForm.valueChanges.subscribe((value) => {
      console.log(value);
      console.log(this.option);
      const changes = this._differ.diff(value);
      if (changes) {
        console.log('has change');
        setTimeout(() => this._updateSeries());
        //this._applyChanges(changes);
      }

    });

  }

}

