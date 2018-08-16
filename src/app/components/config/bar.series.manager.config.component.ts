import {
  AfterViewInit,
  Component, EventEmitter, forwardRef, Input,
  KeyValueDiffer,
  KeyValueDiffers, NgZone,
  Output, TemplateRef,
  ViewChild,
} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgForm} from '@angular/forms';

import {NzModalService} from 'ng-zorro-antd';
import {CustomControlValueAccessor} from './CustomControlValueAccessor';
import {BarSeriesConfig} from '@core/node/content/chart/echart.interface/series/bar.series';

export const SERIES_CONFIG_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BarSeriesManagerConfigComponent),
  multi: true
};

@Component({
  selector: 'app-bar-series-manager-config',
  templateUrl: './bar.series.manager.config.component.html',
  styleUrls: ['./bar.series.manager.config.component.less'],
  providers: [SERIES_CONFIG_VALUE_ACCESSOR]
})
export class BarSeriesManagerConfigComponent extends CustomControlValueAccessor implements AfterViewInit {

  option: Array<BarSeriesConfig> = [];

  @Output() axisChange = new EventEmitter();


  private _differ: KeyValueDiffer<any, any>;
  private _filterArray: Array<any> = [];

  constructor(private _differs: KeyValueDiffers,
              private _modalService: NzModalService,
              private _zone: NgZone) {
    super();
  }

  addSerious() {
    this.option.push({
      type: 'bar',
      name: `系列${this.option.length + 1}`
    });
  }

  seriesChange($event) {
    this._propagateChange(this.option);
    console.log('BarSeriesManagerConfigComponent seriesChange', JSON.stringify(this.option));
  }

  ngAfterViewInit() {
    // this.ngForm.valueChanges.subscribe((value) => {
    //   const changes = this._differ.diff(value);
    //   if (changes) {
    //     console.log('AxisConfigComponent valueChanges');
    //     console.log(value);
    //     this.seriesChange.emit();
    //   }
    //
    // });
  }

}
