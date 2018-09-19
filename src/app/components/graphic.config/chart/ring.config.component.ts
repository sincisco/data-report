import {
  AfterViewInit,
  Component,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
  ViewChild
} from '@angular/core';
import {NgForm} from '@angular/forms';
import {datasetManager} from '../../../core/dataset/dataset.manager';

import {NzModalService} from 'ng-zorro-antd';
import {GraphicConfig} from '../graphic.config';

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
  selector: 'app-ring-config',
  templateUrl: './map.config.component.html',
  styleUrls: ['./map.config.component.less']
})
export class RingConfigComponent extends GraphicConfig implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;

  option: any = {
    backgroundColor: 'rgba(13, 16, 41, 0.12)',
    color: ['#FE0404', '#00DC58', '#FBA200', '#00CEFF'],
    title: {
      show: false,
      top: 20,
      text: '会员活跃度” - 山东省',
      subtext: '',
      x: 'center',
      textStyle: {
        color: '#ccc'
      }
    },
    tooltip: {
      show: false
    },
    series: [{
      name: '访问来源',
      type: 'pie',
      radius: ['30%', '45%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          formatter: '{b|{b}} {c|{c}} 台',
          color: '#fff',
          rich: {
            b: {
              color: '#fff'
            },
            c: {
              fontWeight: 'bold'
            }
          }
        }
      },
      labelLine: {
        normal: {
          show: true,
          lineStyle: {
            color: '#274862'
          },
          length: 45
        }
      },
      data: [{
        value: 335,
        name: '危急'
      },
        {
          value: 310,
          name: '高危'
        },
        {
          value: 234,
          name: '中危'
        },
        {
          value: 135,
          name: '低危'
        }
      ],
      z: 5
    },
      {
        type: 'pie',
        radius: '60%',
        data: [{
          value: 430,
          itemStyle: {
            normal: {
              color: 'rgba(0,0,0,0)',
              borderColor: 'rgba(0,0,0,0)'
            }
          }
        }],
        labelLine: {
          normal: {
            show: false
          }
        },
        z: 5,
        tooltip: {
          show: false
        },
        hoverAnimation: false,
        label: {
          normal: {
            position: 'center',
            formatter: '{c|{c}} {text|台}',
            color: '#fff',
            rich: {
              c: {
                fontWeight: 'bold',
                color: '#fff',
                fontSize: 40
              },
              text: {
                color: '#5B7DA3'
              }
            }
          }
        }
      },
      {
        type: 'pie',
        radius: '60%',
        data: [{
          value: 430,
          itemStyle: {
            normal: {
              borderWidth: 2,
              color: 'rgba(0,0,0,0)',
              borderColor: '#202D3C'
            }
          }
        }],
        labelLine: {
          normal: {
            show: false
          }
        },
        z: 1,
        tooltip: {
          show: false
        },
        hoverAnimation: false,
        label: {
          normal: {
            show: false
          }
        }
      },
      {
        name: 'x',
        type: 'pie',
        radius: ['0', '10%'],
        data: [{
          value: 1,
          itemStyle: {
            normal: {
              color: '#243443',
              shadowBlur: 50,
              shadowColor: '#202E3B'
            },
            emphasis: {
              color: '#243443',
              shadowBlur: 50,
              shadowColor: '#202E3B'
            }
          }
        }],
        labelLine: {
          normal: {
            show: false
          }
        },
        z: 2,
        tooltip: {
          show: false
        },
        hoverAnimation: false
      },
      {
        name: 'x',
        type: 'pie',
        radius: ['10%', '20%'],
        data: [{
          value: 1,
          itemStyle: {
            normal: {
              color: '#202E3B',
              shadowBlur: 50,
              shadowColor: '#1C2834'
            },
            emphasis: {
              color: '#202E3B',
              shadowBlur: 50,
              shadowColor: '#1C2834'
            }
          }
        }],
        labelLine: {
          normal: {
            show: false
          }
        },
        z: 2,
        tooltip: {
          show: false
        },
        hoverAnimation: false
      },
      {
        name: 'x',
        type: 'pie',
        radius: ['20%', '30%'],
        data: [{
          value: 1,
          itemStyle: {
            normal: {
              color: '#1C2834',
              shadowBlur: 50,
              shadowColor: '#1b1e25'
            },
            emphasis: {
              color: '#1C2834',
              shadowBlur: 50,
              shadowColor: '#1b1e25'
            }
          }
        }],
        labelLine: {
          normal: {
            show: false
          }
        },
        z: 2,
        tooltip: {
          show: false
        },
        hoverAnimation: false
      },
      {
        name: 'x',
        type: 'pie',
        radius: ['45%', '55%'],
        data: [{
          value: 1,
          itemStyle: {
            normal: {
              color: '#111A27',
              shadowBlur: 50,
              shadowColor: '#1b1e25'
            },
            emphasis: {
              color: '#111A27',
              shadowBlur: 50,
              shadowColor: '#1b1e25'
            }
          }
        }],
        labelLine: {
          normal: {
            show: false
          }
        },
        z: 2,
        tooltip: {
          show: false
        },
        hoverAnimation: false
      },
      {
        name: 'x',
        type: 'pie',
        radius: ['45%', '50%'],
        data: [{
          value: 1,
          itemStyle: {
            normal: {
              color: '#111A27',
              shadowBlur: 50,
              shadowColor: '#1b1e25'
            },
            emphasis: {
              color: '#111A27',
              shadowBlur: 50,
              shadowColor: '#1b1e25'
            }
          }
        }],
        labelLine: {
          normal: {
            show: false
          }
        },
        z: 2,
        tooltip: {
          show: false
        },
        hoverAnimation: false
      },
      {
        name: 'x',
        type: 'pie',
        radius: ['50%', '60%'],
        itemStyle: {
          normal: {
            color: '#0C141C',
            shadowBlur: 50,
            shadowColor: '#1b1e25'
          },
          emphasis: {
            color: '#0C141C',
            shadowBlur: 50,
            shadowColor: '#1b1e25'
          }
        },
        data: [{
          value: 1
        }],
        labelLine: {
          normal: {
            show: false
          }
        },
        z: 2,
        tooltip: {
          show: false
        },
        hoverAnimation: false
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

      value.dataset = datasetManager.current;
      value.tooltip = {};
      value = removeUndefined(value);
      this.trigger({
        key: 'option',
        oldValue: this._innerOption,
        newValue: this.option,
        option: this.option
      });
      this._innerOption = this.option;

    });

  }


}

