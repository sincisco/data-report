import {
  AfterViewInit,
  Component,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
  ViewChild
} from '@angular/core';
import {NgForm} from '@angular/forms';

import {NzModalService} from 'ng-zorro-antd';
import {DesignGraphicConfig} from '../../../core/source/config.source/design.config.source';

import {removeUndefined} from '../../../utils/common';
import {debounceTime} from 'rxjs/operators';
import {ChartBarOption} from '../../../core/node/graphic/chart/bar.chart.graphic';
import * as _ from 'lodash';

@Component({
  selector: 'app-bar-config',
  templateUrl: './bar.config.component.html',
  styleUrls: ['./bar.config.component.less']
})
export class BarConfigComponent extends DesignGraphicConfig implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;

  option: ChartBarOption = {
    title: {
      show: true,
      text: '默认标题',
      left: 'auto',
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      backgroundColor: 'transparent',
      textStyle: {
        align: 'left'
      }
    },
    tooltip: {},
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

  private _differ: KeyValueDiffer<any, any>;

  private _innerOption = {};

  constructor(private modalService: NzModalService, private _differs: KeyValueDiffers) {
    super();
  }

  exportOption() {
    return _.cloneDeep(this._innerOption);
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }

  ngAfterViewInit() {
    this.ngForm.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      console.log('BarConfigComponent  valueChanges', value);
      value = removeUndefined(value);
      this._innerOption = value;
      this._subject.next({
        key: 'option',
        oldValue: this._innerOption,
        newValue: value,
        option: value
      });

    });

  }


}

