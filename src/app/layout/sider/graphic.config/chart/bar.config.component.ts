import {
  AfterViewInit,
  Component, DoCheck,
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
import {Dimension} from '@core/dataset/dataset.interface';

@Component({
  selector: 'app-bar-config',
  templateUrl: './bar.config.component.html',
  styleUrls: ['./bar.config.component.less']
})
export class BarConfigComponent implements AfterViewInit, OnInit, IDataComponent {

  @ViewChild(NgForm) ngForm: NgForm;
  @ViewChild('modalTitle') tplTitle: TemplateRef<any>;
  @Output() output = new EventEmitter();

  option: ChartBarOption = {
    xAxis: {
      type: 'category',
      name: '123',
      nameGap: 10,
      axisLabel: {},
      axisTick: {}
    },
    yAxis: {
      axisLabel: {},
      axisTick: {}
    },
    series: []
  };

  seriesX: Array<Dimension> = [];
  seriesY: Array<Dimension> = [];
  private _differ: KeyValueDiffer<any, any>;

  constructor(private modalService: NzModalService, private _differs: KeyValueDiffers) {
  }

  ngAxisChange($event) {
    console.log(JSON.stringify($event));
    this._updateSeries();
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }

  private _updateSeries() {
    if (this.seriesX.length === 0 || this.seriesY.length === 0) {
      return;
    }
    this.option.series = [];
    // this.option.dataset = Object.assign({},
    //   datasetManager.current,
    //   {source: filterExecutor.execute(datasetManager.current.source, this.filterArray)});
    this.option.dataset = datasetManager.current;
    this.option.series.push({
      type: 'bar',
      name: 'test',
      encode: {
        x: this.seriesX.map((value) => {
          return value.name;
        }),
        y: this.seriesY.map((value) => {
          return value.name;
        })
      }
    });
    this.output.emit(this.option);
  }

  ngAfterViewInit() {
    this.ngForm.valueChanges.subscribe((value) => {
      console.log('BarConfigComponent  valueChanges');
      console.log(value);
      const changes = this._differ.diff(value);
      if (changes) {
        console.log('BarConfigComponent  has change');
      }
    });
  }

}

