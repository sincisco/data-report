import {AfterContentInit, ContentChild, Directive, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, NgControl} from '@angular/forms';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[appControlMonitor]',
  host: {
    '[class.has-error]': 'hasError'
  }
})
export class ControlMonitorDirective implements OnDestroy, OnInit, AfterContentInit {
  private _hasFeedback = false;
  validateChanges: Subscription;
  validateString: string;
  controlStatus: string;
  controlClassMap;
  @ContentChild(NgControl) validateControl: FormControl;

  hasError: boolean;

  @Input()
  set nzHasFeedback(value: boolean) {
    this._hasFeedback = !!value;
    this.setControlClassMap();
  }

  get nzHasFeedback(): boolean {
    return this._hasFeedback;
  }

  @Input()
  set nzValidateStatus(value: string | FormControl) {
    if (value instanceof FormControl) {
      this.validateControl = value;
      this.validateString = null;
      this.controlStatus = null;
      this.setControlClassMap();
      this.watchControl();
    } else {
      this.validateString = value;
      this.validateControl = null;
      this.removeSubscribe();
      this.setControlClassMap();
    }
  }

  watchControl(): void {
    this.removeSubscribe();
    /** miss detect https://github.com/angular/angular/issues/10887 **/
    if (this.validateControl && this.validateControl.statusChanges) {
      this.validateChanges = this.validateControl.statusChanges.subscribe(data => this.updateValidateStatus(data));
    }

  }

  removeSubscribe(): void {
    if (this.validateChanges) {
      this.validateChanges.unsubscribe();
      this.validateChanges = null;
    }
  }

  updateValidateStatus(status: string): void {
    console.log('**************updateValidateStatus');
    if (this.validateControl.dirty || this.validateControl.touched) {
      this.controlStatus = status;
      this.setControlClassMap();
    } else {
      this.controlStatus = null;
      this.setControlClassMap();
    }
  }

  setControlClassMap(): void {
    this.controlClassMap = {
      [`has-warning`]: this.validateString === 'warning',
      [`is-validating`]: this.validateString === 'validating' || this.validateString === 'pending' || this.controlStatus === 'PENDING',
      [`has-error`]: this.validateString === 'error' || this.controlStatus === 'INVALID',
      [`has-success`]: this.validateString === 'success' || this.controlStatus === 'VALID',
      [`has-feedback`]: this.nzHasFeedback
    };
    this.hasError = this.controlClassMap['has-error'];
  }

  ngOnInit(): void {
    this.setControlClassMap();
  }

  ngOnDestroy(): void {
    this.removeSubscribe();
  }

  ngAfterContentInit(): void {
    this.watchControl();
    if (this.validateControl) {
      this.updateValidateStatus(this.validateControl.status);
    }
  }
}
