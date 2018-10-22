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
import * as _ from 'lodash';


@Component({
  selector: 'app-gauge-config',
  templateUrl: './gauge.config.component.html',
  styleUrls: ['./gauge.config.component.less']
})
export class GaugeConfigComponent extends DesignGraphicConfig implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;

  option: any = {
    backgroundColor: 'rgba(13, 16, 41, 0.12)',
    title: {
      show: false,
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
    series: [{
      name: '刻度',
      type: 'gauge',
      radius: '90%',
      center: ['50%', '55%'],
      min: 0,
      max: 1000,
      splitNumber: 10, // 刻度数量
      startAngle: 220,
      endAngle: -40,
      axisLine: {
        show: true,
        lineStyle: {
          width: 1,
          color: [[1, 'rgba(0,0,0,0)']]
        }
      }, // 仪表盘轴线
      axisLabel: {
        show: true,
        color: '#fff',
        distance: 20
      }, // 刻度标签。
      axisTick: {
        show: true,
        lineStyle: {
          color: '#fff',
          width: 1
        },
        length: -8
      }, // 刻度样式
      splitLine: {
        show: true,
        length: -20,
        lineStyle: {
          color: '#fff'
        }
      }, // 分隔线样式
      detail: {
        show: false
      },
      pointer: {
        show: false
      }
    },
      {


        type: 'gauge',
        radius: '70%',
        center: ['50%', '55%'],

        splitNumber: 0, // 刻度数量
        startAngle: 220,
        endAngle: -40,
        axisLine: {
          show: true,
          lineStyle: {
            width: 20,
            color: [
              [
                0.98, new echarts.graphic.LinearGradient(
                0, 0, 1, 0, [{
                  offset: 0,
                  color: '#ae3df6'
                },
                  {
                    offset: 1,
                    color: '#53bef9'
                  }
                ]
              )
              ],
              [
                1, '#222e7d'
              ]
            ]
          }
        },
        // 分隔线样式。
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        pointer: {
          show: false
        },
        title: {
          show: true,
          offsetCenter: [0, '-20%'], // x, y，单位px
          textStyle: {
            color: '#ddd',
            fontSize: 24
          }
        },
        // 仪表盘详情，用于显示数据。
        detail: {
          show: true,
          offsetCenter: [0, 0],
          color: '#ddd',
          formatter: function (params) {
            return params;
          },
          textStyle: {
            fontSize: 18
          }
        },
        data: [{
          name: '当前用户总数',
          value: 9800
        }]
      }
    ]
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
      value.tooltip = {};
      value = removeUndefined(value);
      this._subject.next({
        key: 'option',
        oldValue: this._innerOption,
        newValue: this.option,
        option: this.option
      });
      this._innerOption = this.option;

    });

  }


}

