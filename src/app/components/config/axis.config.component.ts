import {
  AfterViewInit,
  Component, EventEmitter, forwardRef, Input,
  KeyValueDiffer,
  KeyValueDiffers, NgZone,
  OnInit, Output,
  ViewChild,
} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgForm} from '@angular/forms';

import {NzModalService} from 'ng-zorro-antd';
import {CustomControlValueAccessor} from './CustomControlValueAccessor';
import {removeUndefined} from '../../utils/common';
import {Axis} from '@core/node/graphic.view/chart/echart.interface/axis';
import {debounceTime} from 'rxjs/operators';

export const AXIS_CONFIG_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AxisConfigComponent),
  multi: true
};

@Component({
  selector: 'app-axis-config',
  templateUrl: './axis.config.component.html',
  styleUrls: ['./axis.config.component.less'],
  providers: [AXIS_CONFIG_VALUE_ACCESSOR]
})
export class AxisConfigComponent extends CustomControlValueAccessor implements AfterViewInit, OnInit {


  @ViewChild(NgForm) ngForm: NgForm;

  @Input() option: Axis = {
    axisLabel: {},
    axisTick: {}
  };

  private _differ: KeyValueDiffer<any, any>;
  private _filterArray: Array<any> = [];

  axisState = true;
  nameState = false;
  axisLineState = false;
  axisTickState = false;
  axisLabelState = false;


  constructor(private _differs: KeyValueDiffers,
              private _modalService: NzModalService,
              private _zone: NgZone) {
    super();
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }

  ngAfterViewInit() {
    this.ngForm.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      console.log('AxisConfigComponent valueChanges', value);
      this._propagateChange(removeUndefined(value));
    });
  }
}
