import {ControlValueAccessor} from '@angular/forms';

export class CustomControlValueAccessor implements ControlValueAccessor {

  protected option: any;

  protected _propagateChange = (_: any) => {
  };

  writeValue(value: any) {
    if (value) {
      this.option = value;
    }
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // this._propagateChange = fn;
  }


}
