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
import {ContextMenuHelper} from '../../../../utils/contextMenu';
import {TextContent} from '../../../../node/content/text.content';
import {HtmlImage} from '../../../../node/content/html/image.html';
import {CommentContent} from '../../../../node/content/comment.content';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'data-bar',
  templateUrl: './data.bar.component.html',
  styleUrls: ['./data.bar.component.less']
})
export class DataBarComponent implements AfterViewInit, OnInit, IDataComponent {

  @ViewChild(NgForm) ngForm: NgForm;
  @ViewChild('modalTitle') tplTitle: TemplateRef<any>;
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

  constructor(private modalService: NzModalService, private _differs: KeyValueDiffers) {
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
        icon: 'u-icn-filter',
        callback: () => {
          this.createComponentModal();
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

        }
      }
    ], $event.pageX, $event.pageY, $event, true);
  }


  createComponentModal(): void {
    const modal = this.modalService.create({
      nzTitle: this.tplTitle,
      nzContent: NzModalCustomComponent,
      nzWidth: '870px',
      nzWrapClassName: 'filter-window',
      nzComponentParams: {
        title: 'title in component',
        subtitle: 'component sub title，will be changed after 2 sec'
      },
      nzFooter: [{
        label: 'change component tilte from outside',
        onClick: (componentInstance) => {
          componentInstance.title = 'title in inner component is changed';
        }
      }]
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

@Component({
  selector: 'nz-modal-custom-component',
  template: `
    <div class="m-mfilter-discrete" style="margin-top: -8px;margin-bottom: -8px;">
      <div class="part1">
        <nz-tabset [nzTabPosition]="'top'" nzType="card" nzSize="small">
          <nz-tab nzTitle="列表筛选">
            <div class="m-tsearch">
              <div class="switch">
                <label><input type="radio" name="mode" value="list"> 列表</label>
                <label><input type="radio" name="mode" value="manual"> 手动</label></div>

              <div class="list sec" style="">

                <div class="affectMenu">
                  <div class="m-tgmenu m-tgmenu-" title="显示完整列表">
                    <div class="piece"></div>
                    <div class="piece"></div>
                    <div class="piece"></div>
                  </div>
                  <div class="m-tgmenu" title="升序(点击切换为降序)">
                    <span class="u-icn u-icn-asc"></span>
                  </div>
                </div>
                <div class="m-search entire">
                  <button class="u-btn btn-search">搜索</button>
                  <div class="search">
                    <span class="u-icn-search u-icn"></span>
                    <input placeholder="输入关键词搜索" class="u-ipt-search">
                    <i class="u-icn u-icn-close" style="display: none;"></i>
                  </div>
                  <!--Regular if331-->
                </div>


                <!--Regular if332-->
                <ul class="result u-list" style="height: 280px;">
                  <li class="placeholder" style="height: 0px;"></li>
                  <!--Regular list-->
                  <li class=""><label><input type="checkbox"><b>
                    北京市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    长春市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    长沙市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    成都市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    大连市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    广州市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    哈尔滨市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    杭州市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    合肥市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    济南市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    兰州市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    南京市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    青岛市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    厦门市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    上海市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    沈阳市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    天津市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    武汉市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    西安市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    咸阳市 </b></label></li>

                  <li class=""><label><input type="checkbox"><b>
                    重庆市 </b></label></li>

                  <li class="placeholder" style="height: 0px;"></li>
                </ul>
                <div class="binfo">
                  <label><input type="radio" value="1"><b>包含</b></label>
                  <label><input type="radio" value="2"><b>排除</b></label>
                  <label><input type="radio" value="3"><b>使用全部</b></label>
                  <div class="needContext f-fr"></div>
                </div>
                <p class="binfo2">共21个结果</p>
              </div>

              <div class="sec manual" style="display: none;">
                <div class="m-search m-search-manual">
                  <div class="search">
                    <input placeholder="输入您要添加的项, 并回车确认">
                    <span class="icns" style="display: none;">
        <i class="u-icn u-icn-add"></i>
        <i class="u-icn u-icn-close"></i>
      </span>
                  </div>
                </div>
                <ul class="result u-list" style="height: 280px;">
                  <!--Regular list-->
                </ul>
                <p class="binfo">
                  <label><input type="checkbox" disabled="disabled"><b>排除</b></label>
                </p>
              </div>
            </div>
          </nz-tab>
          <nz-tab nzTitle="文本筛选">
            Content of Tab Pane
          </nz-tab>
          <nz-tab nzTitle="条件筛选">
            Content of Tab Pane
          </nz-tab>
          <nz-tab nzTitle="高级筛选">
            Content of Tab Pane
            <h2>{{ title }}</h2>
            <h4>{{ subtitle }}</h4>
            Content of Tab Pane
            <button nz-button [nzType]="'primary'" (click)="destroyModal()">destroy modal</button>
          </nz-tab>
        </nz-tabset>
      </div>
      <div class="part2 m-finfo">
        <h3>筛选汇总</h3>
        <div class="finfo_content">
          <ul>
            <li><span class="finfo_left">所选字段:</span>
              <p class="finfo_right">省份</p></li>
            <li class="z-active"><span class="finfo_left">列表筛选:</span>
              <p class="finfo_right">无</p></li>
            <li class=""><span class="finfo_left">文本筛选:</span>
              <p class="finfo_right">无</p></li>
            <li class=""><span class="finfo_left">条件筛选:</span>
              <p class="finfo_right">无</p></li>
            <li class=""><span class="finfo_left">高级筛选:</span>
              <p class="finfo_right">无</p></li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./filter.modal.less']
})
export class NzModalCustomComponent {
  @Input() title: string;
  @Input() subtitle: string;

  constructor(private modal: NzModalRef) {
  }

  destroyModal(): void {
    this.modal.destroy({data: 'this the result data'});
  }
}
