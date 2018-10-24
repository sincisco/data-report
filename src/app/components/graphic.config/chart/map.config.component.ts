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
import {convertData, provinceCityMap} from '@core/data/geo.map';

const data = [
  {name: '济南市', value: 390},
  {name: '菏泽市', value: 158},
  {name: '德州市', value: 252},
  {name: '聊城市', value: 99},
  {name: '泰安市', value: 189},
  {name: '临沂市', value: 52},
  {name: '淄博市', value: 158},
  {name: '枣庄市', value: 152},
  {name: '滨州市', value: 189},
  {name: '潍坊市', value: 160},
  {name: '东营市', value: 80},
  {name: '青岛市', value: 180},
  {name: '烟台市', value: 190},
  {name: '威海市', value: 290},
  {name: '日照市', value: 190},
  {name: '济宁市', value: 190},
  {name: '莱芜市', value: 290},
];

@Component({
  selector: 'app-map-config',
  templateUrl: './map.config.component.html',
  styleUrls: ['./map.config.component.less']
})
export class MapConfigComponent extends DesignGraphicConfig implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;

  option: any = {
    backgroundColor: '#020933',
    title: {
      top: 20,
      text: '会员活跃度 - 山东省',
      subtext: '',
      x: 'center',
      textStyle: {
        color: '#ccc'
      }
    },

    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        if (typeof(params.value)[2] === 'undefined') {
          return params.name + ' : ' + params.value;
        } else {
          return params.name + ' : ' + params.value[2];
        }
      }
    },
    legend: {
      orient: 'vertical',
      y: 'bottom',
      x: 'right',
      data: ['pm2.5'],
      textStyle: {
        color: '#fff'
      }
    },
    visualMap: {
      show: true,
      min: 0,
      max: 500,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'], // 文本，默认为数值文本
      calculable: true,
      seriesIndex: [1],
      inRange: {
        // color: ['#3B5077', '#031525'] // 蓝黑
        // color: ['#ffc0cb', '#800080'] // 红紫
        // color: ['#3C3B3F', '#605C3C'] // 黑绿
        // color: ['#0f0c29', '#302b63', '#24243e'] // 黑紫黑
        // color: ['#23074d', '#cc5333'] // 紫红
        // color: ['#00467F', '#A5CC82'] // 蓝绿
        // color: ['#1488CC', '#2B32B2'] // 浅蓝
        // color: ['#00467F', '#A5CC82'] // 蓝绿
        // color: ['#00467F', '#A5CC82'] // 蓝绿
        // color: ['#00467F', '#A5CC82'] // 蓝绿
        // color: ['#00467F', '#A5CC82'] // 蓝绿

      }
    },
    geo: {
      show: true,
      map: '山东',
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: false,
        }
      },
      roam: true,
      itemStyle: {
        normal: {
          areaColor: 'transparent',
          borderColor: '#3fdaff',
          borderWidth: 2,
          shadowColor: 'rgba(63, 218, 255, 0.5)',
          shadowBlur: 20
        },
        emphasis: {
          areaColor: '#2B91B7',
        }
      }
    },
    series: [
      {
        name: 'light',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: convertData(data, provinceCityMap['山东']),
        symbolSize: function (val) {
          return val[2] / 20;
        },
        label: {
          normal: {
            formatter: '{b} 123',
            position: 'right',
            show: true
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: '#F4E925'
          }
        }
      },
      {
        type: 'map',
        map: '山东',
        geoIndex: 0,
        aspectScale: 0.75, // 长宽比
        showLegendSymbol: false, // 存在legend时显示
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: false,
            textStyle: {
              color: '#fff'
            }
          }
        },
        roam: true,
        itemStyle: {
          normal: {
            areaColor: '#031525',
            borderColor: '#FFFFFF',
          },
          emphasis: {
            areaColor: '#2B91B7'
          }
        },
        animation: false,
        data: data
      },
      {
        name: 'Top 5',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: convertData(data.sort(function (a, b) {
          return b.value - a.value;
        }).slice(0, 5), provinceCityMap['山东']),
        symbolSize: function (val) {
          return val[2] / 15;
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: '#F4E925',
            shadowBlur: 10,
            shadowColor: '#05C3F9'
          }
        },
        zlevel: 1
      },

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

