import {
  AfterViewInit,
  Component, forwardRef, NgZone,
  ViewChild,
} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgForm} from '@angular/forms';
import {CustomControlValueAccessor} from './CustomControlValueAccessor';

export const COLOR_CONFIG_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ColorConfigComponent),
  multi: true
};

@Component({
  selector: 'app-color-config',
  templateUrl: './color.config.component.html',
  styleUrls: ['./color.config.component.less'],
  providers: [COLOR_CONFIG_VALUE_ACCESSOR]
})
export class ColorConfigComponent extends CustomControlValueAccessor implements AfterViewInit {


  @ViewChild(NgForm) ngForm: NgForm;

  option: Array<string> = [];

  listOfColors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];


  constructor(private zone: NgZone) {
    super();
  }

  ngAfterViewInit() {
    this.ngForm.valueChanges.subscribe((value) => {
      console.log('ColorConfigComponent valueChanges');
      console.log(value);

      this._propagateChange(value.color);
    });
  }

}
