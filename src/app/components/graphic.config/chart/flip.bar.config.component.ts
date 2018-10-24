import {
  AfterViewInit,
  Component,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
  ViewChild
} from '@angular/core';
import {NgForm} from '@angular/forms';
import {dataModelManager} from '../../../core/data/data.model.manager';

import {NzModalService} from 'ng-zorro-antd';
import {DesignGraphicConfig} from '../../../core/source/config.source/design.config.source';

import {removeUndefined} from '../../../utils/common';
import {debounceTime} from 'rxjs/operators';
import * as _ from 'lodash';

var xData = ['正式', '预备', '支部', '总支', '党委'];

var data = [13.7, 13.4, 13.5, 16.1, 17.4];


@Component({
  selector: 'app-flip-bar-config',
  templateUrl: './map.config.component.html',
  styleUrls: ['./map.config.component.less']
})
export class FlipBarConfigComponent extends DesignGraphicConfig implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;

  option: any = {
    backgroundColor: 'rgba(13, 16, 41, 0.12)',
    title: {
      text: '',
      textStyle: {
        color: '#fff',
        fontSize: '22'
      },
      subtextStyle: {
        color: '#90979c',
        fontSize: '16',

      },
    },
    tooltip: {
      show: 'true',
      trigger: 'item',
      backgroundColor: 'rgba(0,0,0,0.7)', // 背景
      padding: [10, 10], //内边距
    },
    grid: {
      borderWidth: 0,
      top: 30,
      left: 35,
      right: 15,
      bottom: 30,
      textStyle: {
        color: '#fff'
      }
    },
    yAxis: [{
      type: 'category',
      axisTick: {
        show: false
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#363e83',
        }
      },
      axisLabel: {
        inside: false,
        textStyle: {
          color: '#bac0c0',
          fontWeight: 'normal',
          fontSize: '12',
        },
        // formatter:function(val){
        //     return val.split("").join("\n")
        // },
      },
      data: xData,
    }, {
      type: 'category',
      axisLine: {
        show: true
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitArea: {
        show: false
      },
      splitLine: {
        show: false
      },
      data: xData,
    }],
    xAxis: {
      type: 'value',
      axisTick: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#2f3640',
        }
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#2f3640 ',
        }
      },
      axisLabel: {
        textStyle: {
          color: '#bac0c0',
          fontWeight: 'normal',
          fontSize: '12',
        },
        formatter: '{value}个',
      },
    },
    series: [{
      name: '',
      type: 'bar',
      itemStyle: {
        normal: {
          show: true,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#00c0e9'
          }, {
            offset: 1,
            color: '#3b73cf'
          }]),
          barBorderRadius: 50,
          borderWidth: 0,
        },
        emphasis: {
          shadowBlur: 15,
          shadowColor: 'rgba(105,123, 214, 0.7)'
        }
      },
      zlevel: 2,
      barWidth: '20%',
      data: data,
    },
      {
        name: '',
        type: 'bar',
        yAxisIndex: 1,
        zlevel: 1,
        itemStyle: {
          normal: {
            color: '#121847',
            borderWidth: 0,
            shadowBlur: {
              shadowColor: 'rgba(255,255,255,0.31)',
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 2,
            },
          }
        },
        barWidth: '20%',
        data: [30, 30, 30, 30, 30]
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
    this.ngForm.valueChanges.pipe(debounceTime(100)).subscribe((value) => {
      console.log('BarConfigComponent  valueChanges', value);

      // value.dataset = dataModelManager.current;
      value.tooltip = {};
      value = removeUndefined(value);
      this._trigger({
        key: 'option',
        oldValue: this._innerOption,
        newValue: this.option,
        option: this.option
      });
      this._innerOption = this.option;

    });

  }


}

