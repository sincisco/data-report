import {
  AfterViewInit,
  Component, forwardRef, Input,
  ViewChild,
} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgForm} from '@angular/forms';

import {CustomControlValueAccessor} from './CustomControlValueAccessor';

import * as _ from 'lodash';
import {removeUndefined} from '../../utils/common';
import {Title} from '@core/node/graphic.view/chart/echart.interface/title';
import {debounceTime} from 'rxjs/operators';

export const Title_CONFIG_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TitleConfigComponent),
  multi: true
};

@Component({
  selector: 'app-title-config',
  templateUrl: './title.config.component.html',
  styleUrls: ['./title.config.component.less'],
  providers: [Title_CONFIG_VALUE_ACCESSOR]
})
export class TitleConfigComponent extends CustomControlValueAccessor implements AfterViewInit {


  @ViewChild(NgForm) ngForm: NgForm;

  option: Title = {
    textStyle: {}
  };

  textState = false;
  subtextState = false;

  fontSizeArray = [10, 12, 14, 16, 18, 20, 24, 32, 40];

  fontStyleArray = ['normal', 'italic', 'oblique'];

  fontWeightArray = ['normal',
    'bold',
    'bolder',
    'lighter',
    100, 200, 300, 400, 500, 600, 800];

  fontFamilyArray = [
    ['serif', 'serif'],
    ['Courier New', 'Courier New'],
    ['楷体', 'KaiTi'],
    ['黑体', 'SimHei'],
    ['宋体', 'SimSun'],
    ['微软雅黑', 'Microsoft YaHei'],
    ['华文细黑', 'STXihei'],
    ['华文楷体', 'STKaiti'],
    ['华文宋体', 'STSong'],
    ['华文彩云', 'STCaiyun'],
    ['华文琥珀', 'STHupo'],
    ['华文隶书', 'STLiti'],
    ['华文行楷', 'STXingkai']
  ];

  constructor() {
    super();
  }

  ngAfterViewInit() {
    this.ngForm.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      console.log('TitleConfigComponent valueChanges', this.ngForm.valid);
      if (this.ngForm.valid) {
        this._propagateChange(removeUndefined(value));
      }
    });
  }

}


