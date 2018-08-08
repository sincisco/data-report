import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';
import {Directive} from '@angular/core';

@Directive({
  selector: '[appHorizontalPosition]',
  providers: [{provide: NG_VALIDATORS, useExisting: HorizontalPositionDirective, multi: true}]
})
export class HorizontalPositionDirective implements Validator {

  validate(control: AbstractControl): { [key: string]: any } | null {
    const result = /^([1-9][0-9]*|auto|left|right|center)$/.test(control.value);
    return result ? null
      : {
        'aa': 1
      };
  }
}

@Directive({
  selector: '[appVerticalPosition]',
  providers: [{provide: NG_VALIDATORS, useExisting: VerticalPositionDirective, multi: true}]
})
export class VerticalPositionDirective implements Validator {

  validate(control: AbstractControl): { [key: string]: any } | null {
    const result = /^([1-9][0-9]*|auto|top|middle|bottom)$/.test(control.value);
    return result ? null
      : {
        'aa': 1
      };
  }
}


export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {'forbiddenName': {value: control.value}} : null;
  };
}
