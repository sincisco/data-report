import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {NgForm} from '@angular/forms';

import {dataModelManager} from '../../../core/data/data.model.manager';

import {DesignGraphicConfig} from '../../../core/source/config.source/design.config.source';
import {ChartLineOption} from '../../../core/node/graphic/chart/line.chart.graphic';
import {debounceTime} from 'rxjs/operators';
import {removeUndefined} from '../../../utils/common';


@Component({
  selector: 'app-line-config',
  templateUrl: './line.config.component.html',
  styleUrls: ['./line.config.component.less']
})
export class LineConfigComponent extends DesignGraphicConfig implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;
  @ViewChild('modalTitle') tplTitle: TemplateRef<any>;
  @Output() output = new EventEmitter();

  option: ChartLineOption = {
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
      type: 'line'
    }]
  };

  private _innerOption = {};

  constructor() {
    super();
  }

  ngOnInit() {

  }

  private _updateSeries() {
    // this.option.dataset = Object.assign({},
    //   datasetManager.current,
    //   {source: filterExecutor.execute(datasetManager.current.source, this.filterArray)});
    // this.option.dataset = datasetManager.current;
  }

  ngAfterViewInit() {
    this.ngForm.valueChanges.pipe(debounceTime(100)).subscribe((value) => {
      console.log('LineConfigComponent  valueChanges');
      // value.dataset = dataModelManager.current;
      value = removeUndefined(value);
      this._trigger({
        key: 'option',
        oldValue: this._innerOption,
        newValue: value,
        option: value
      });
      this._subject.next({
        key: 'option',
        oldValue: this._innerOption,
        newValue: value,
        option: value
      });
      console.log(value);
      this._innerOption = value;
    });
  }
}

