import {
  AfterViewInit,
  Component, EventEmitter, forwardRef, Input,
  KeyValueDiffer,
  KeyValueDiffers, NgZone,
  Output, TemplateRef,
  ViewChild,
} from '@angular/core';
import {FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';

import {NzModalService} from 'ng-zorro-antd';
import {CustomControlValueAccessor} from './CustomControlValueAccessor';
import {LineSeriesConfig} from '@core/node/graphic.view/chart/echart.interface/series/line.series';

export const SERIES_CONFIG_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LineSeriesManagerConfigComponent),
  multi: true
};

@Component({
  selector: 'app-line-series-manager-config',
  templateUrl: './line.series.manager.config.component.html',
  styleUrls: ['./line.series.manager.config.component.less'],
  providers: [SERIES_CONFIG_VALUE_ACCESSOR]
})
export class LineSeriesManagerConfigComponent extends CustomControlValueAccessor implements AfterViewInit {

  form = new FormGroup({
    seriesArray: new FormArray([]),
  });
  constructor(private _zone: NgZone) {
    super();
  }

  writeValue(value: any) {
    if (value !== undefined && Array.isArray(value)) {
      value.forEach((item) => {
        this.seriesArray.push(new FormControl(item));
      });
    }
  }

  get seriesArray(): FormArray {
    return this.form.get('seriesArray') as FormArray;
  }

  addSerious() {
    this.seriesArray.push(new FormControl({
      type: 'line',
      name: `系列${this.seriesArray.length + 1}`
    }));
  }
  ngAfterViewInit() {
    this.form.valueChanges.subscribe((value) => {
      console.log(value);
      this._propagateChange(value.seriesArray);
    });
  }

}
