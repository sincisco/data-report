import {AfterViewInit, Component, EventEmitter, KeyValueDiffer, KeyValueDiffers, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IDataComponent} from '../html/header.component';
import {ChartBarItem} from '../../../../node/content/chart/interface';
import {draggableHeler} from '../../../../utils/draggable.helper';
import {ChartBarNode, ChartBarOption} from '../../../../node/content/chart/chart.bar';
import {datasetManager} from '@core/dataset/dataset.manager';
import {HtmlParagraph} from '../../../../node/content/html/paragraph.html';
import {HeaderHtml} from '../../../../node/content/html/header.html';
import {ContextMenuHelper} from '../../../../utils/contextMenu';
import {TextContent} from '../../../../node/content/text.content';
import {HtmlImage} from '../../../../node/content/html/image.html';
import {CommentContent} from '../../../../node/content/comment.content';

@Component({
  selector: 'data-bar',
  templateUrl: './data.bar.component.html',
  styleUrls: ['./data.bar.component.less']
})
export class DataBarComponent implements AfterViewInit, OnInit, IDataComponent {

  @ViewChild(NgForm) ngForm: NgForm;
  @Output() output = new EventEmitter();

  option: ChartBarOption = {
    xAxis: {
      axisLabel: {
        rotate: 90
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

  angle: string;
  private _differ: KeyValueDiffer<any, any>;

  constructor(private _differs: KeyValueDiffers) {
  }

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
    var data = event.dataTransfer.getData('Text');
    console.log(data);

    this.seriesX = draggableHeler.dragInfo;
  }

  dropY(event: DragEvent) {
    //火狐中取消drop默认行为，阻止打开URL
    event.preventDefault();

    var data = event.dataTransfer.getData('Text');
    console.log(JSON.stringify(draggableHeler.dragInfo));
    this.seriesY.push(draggableHeler.dragInfo);
    this.seriesX && this._updateSeries();
  }

  private _updateSeries() {
    this.option.series = [];
    this.option.dataset = datasetManager.current;
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
    ContextMenuHelper.open([
      {
        displayName: '修改显示名称',
        callback: () => {
          console.log('复制');
        }
      }, {
        displayName: '筛选器',
        icon: 'u-icn-filter'
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

        }
      }
    ], $event.pageX, $event.pageY, $event, true);
  }


  ngAfterViewInit() {
    console.log(this.ngForm);
    this.ngForm.valueChanges.subscribe((value) => {
      console.log(value);
      console.log(this.option);
      const changes = this._differ.diff(value);
      if (changes) {
        console.log('has change');
        //this._applyChanges(changes);
      }

    });

  }

}
