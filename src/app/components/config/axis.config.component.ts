import {
  AfterViewInit,
  Component, EventEmitter, forwardRef, Input,
  KeyValueDiffer,
  KeyValueDiffers, NgZone,
  OnInit, Output, TemplateRef,
  ViewChild,
} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgForm} from '@angular/forms';
import {Axis} from '../../node/content/chart/echart.interface/axis';

import {NzModalFilterComponent} from '../../layout/sider/graphic.config/common/filter.modal.component';
import {NzModalService} from 'ng-zorro-antd';
import {Dimension} from '@core/dataset/dataset.interface';

import {draggableHeler} from '../../utils/draggable.helper';
import {contextMenuHelper} from '../../utils/contextMenu';
import {CustomControlValueAccessor} from './CustomControlValueAccessor';
import {removeUndefined} from '../../utils/common';

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

  @Input() option: Axis = {};

  @Output() axisChange = new EventEmitter();

  private _differ: KeyValueDiffer<any, any>;
  private _filterArray: Array<any> = [];

  constructor(private _differs: KeyValueDiffers,
              private _modalService: NzModalService,
              private _zone: NgZone) {
    super();
  }

  ngOnInit() {
    console.log('**************************');
    console.log(JSON.stringify(this.option));
    this._differ = this._differs.find(this.option).create();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ngForm.valueChanges.subscribe((value) => {
        console.log('AxisConfigComponent valueChanges');
        this._propagateChange(removeUndefined(value));
        // const changes = this._differ.diff(value);
        // if (changes) {
        //   console.log('AxisConfigComponent valueChanges');
        //   console.log(value);
        //   this.axisChange.emit();
        // }
      });
    }, 10);
  }
}
