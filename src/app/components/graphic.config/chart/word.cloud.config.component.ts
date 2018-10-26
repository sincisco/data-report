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
  selector: 'app-word-cloud-config',
  templateUrl: './map.config.component.html',
  styleUrls: ['./map.config.component.less']
})
export class WordCloudConfigComponent extends DesignGraphicConfig implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;

  option: any = {
    title: {
      text: '词云展示',
      link: 'https://www.baidu.com/s?wd=' + encodeURIComponent('ECharts'),
      x: 'left',
      textStyle: {
        fontSize: 23,
        color: 'rgba(255, 255, 255, 0.8)'
      }

    },
    backgroundColor: 'rgba(13, 16, 41, 0.12)',
    tooltip: {
      show: true
    },
    series: [{
      name: '热点分析',
      type: 'wordCloud',
      // size: ['9%', '99%'],
      // sizeRange: [6, 66],//最小文字——最大文字
      // textRotation: [0, 45, 90, -45],
      // rotationRange: [-45, 90],//旋转角度区间
      // rotationStep: 90,//旋转角度间隔
      // shape: 'circle',
      // gridSize: 10,//字符间距
      textPadding: 0,
      autoSize: {
        enable: true,
        minSize: 6
      },
      textStyle: {
        normal: {
          color: function () {
            return 'rgb(' + [
              Math.round(Math.random() * 255),
              Math.round(Math.random() * 255),
              Math.round(Math.random() * 255)
            ].join(',') + ')';
          }
        },
        emphasis: {
          shadowBlur: 10,
          shadowColor: '#333'
        }
      },
      data: [{
        name: 'Jayfee',
        value: 666
      }, {
        name: 'Nancy',
        value: 520
      }, {
        name: '生活资源',
        value: '999'
      }, {
        name: '供热管理',
        value: '888'
      }, {
        name: '供气质量',
        value: '777'
      }, {
        name: '生活用水管理',
        value: '688'
      }, {
        name: '一次供水问题',
        value: '588'
      }, {
        name: '交通运输',
        value: '516'
      }, {
        name: '城市交通',
        value: '515'
      }, {
        name: '环境保护',
        value: '483'
      }, {
        name: '房地产管理',
        value: '462'
      }, {
        name: '城乡建设',
        value: '449'
      }, {
        name: '社会保障与福利',
        value: '429'
      }, {
        name: '社会保障',
        value: '407'
      }, {
        name: '文体与教育管理',
        value: '406'
      }, {
        name: '公共安全',
        value: '406'
      }, {
        name: '公交运输管理',
        value: '386'
      }, {
        name: '出租车运营管理',
        value: '385'
      }, {
        name: '供热管理',
        value: '375'
      }, {
        name: '市容环卫',
        value: '355'
      }, {
        name: '自然资源管理',
        value: '355'
      }, {
        name: '粉尘污染',
        value: '335'
      }, {
        name: '噪声污染',
        value: '324'
      }]
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
    this.ngForm.valueChanges.pipe(debounceTime(100)).subscribe((value) => {
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

