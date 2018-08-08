import {
  AfterViewInit,
  Component, forwardRef, Input,
  ViewChild,
} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgForm} from '@angular/forms';
import {Title} from '../../node/content/chart/echart.interface/title';
import {CustomControlValueAccessor} from './CustomControlValueAccessor';

import * as _ from 'lodash';
import {removeUndefined} from '../../utils/common';

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

  option: Title = {};

  constructor() {
    super();
  }

  ngAfterViewInit() {
    this.ngForm.valueChanges.subscribe((value) => {
      console.log('TitleConfigComponent valueChanges', this.ngForm.valid);
      if (this.ngForm.valid) {
        this._propagateChange(removeUndefined(value));
      }
    });
  }

}


