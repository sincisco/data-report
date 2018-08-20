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
import {datasetManager} from '@core/dataset/dataset.manager';

import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import {Dimension} from '@core/dataset/dataset.interface';
import {GraphicConfig} from '../graphic.config';
import {ChartBarOption} from '@core/node/content/chart/bar.chart';
import {removeUndefined} from '../../../../utils/common';

@Component({
  selector: 'app-bar-config',
  templateUrl: './bar.config.component.html',
  styleUrls: ['./bar.config.component.less']
})
export class BarConfigComponent extends GraphicConfig implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;
  @ViewChild('modalTitle') tplTitle: TemplateRef<any>;
  @Output() output = new EventEmitter();

  option: ChartBarOption = {
    title: {
      show: true,
      text: '我是一个大标题',
      left: 'auto',
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      backgroundColor: 'transparent',
      textStyle: {
        align: 'left'
      }
    },
    grid: {
      show: false,
      borderColor: '#ccc',
      backgroundColor: 'transparent',
      left: '10%',
      right: '10%',
      top: 60,
      bottom: 60
    },
    xAxis: {
      type: 'category',
      name: 'X轴名称',
      nameGap: 10,
      axisLabel: {},
      axisTick: {}
    },
    yAxis: {
      axisLabel: {},
      axisTick: {}
    },
    series: [{
      name: '系列1',
      type: 'bar'
    }]
  };

  seriesX: Array<Dimension> = [];
  seriesY: Array<Dimension> = [];
  private _differ: KeyValueDiffer<any, any>;

  constructor(private modalService: NzModalService, private _differs: KeyValueDiffers) {
    super();
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
    setTimeout(() => {
      this.ngForm.valueChanges.subscribe((value) => {
        console.log('BarConfigComponent  valueChanges', value);
        const changes = this._differ.diff(value);
        if (this.graphic) {
          value.dataset = datasetManager.current;
          this.graphic.update(removeUndefined(value));
        }

        if (this.face) {
          value.dataset = datasetManager.current;
          this.face.update(value);
        }
        if (changes) {
          console.log('BarConfigComponent  has change');
        }
      });
    }, 50);
  }


}

