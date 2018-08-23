import {
  AfterViewInit,
  Component, ComponentRef, ElementRef, forwardRef, NgZone, OnInit,
  ViewChild,
} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgModel} from '@angular/forms';
import {CustomControlValueAccessor} from './CustomControlValueAccessor';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {SimpleColorPickerComponent} from '../common/simple.color.picker.component';

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
export class ColorConfigComponent extends CustomControlValueAccessor implements AfterViewInit, OnInit {
  @ViewChild('colorModel') colorModel: NgModel;

  @ViewChild('originFab') originFab: ElementRef;
  overlayRef: OverlayRef;

  option: Array<string>;

  simpleColorPickerComponentPortal: ComponentPortal<SimpleColorPickerComponent>;

  componentRef: ComponentRef<SimpleColorPickerComponent>;

  constructor(private overlay: Overlay, private zone: NgZone) {
    super();
  }

  ngOnInit() {
    const strategy = this.overlay
      .position()
      .connectedTo(this.originFab, {originX: 'center', originY: 'top'}, {overlayX: 'center', overlayY: 'bottom'});
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: strategy
    });
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.detach();
    });
    this.simpleColorPickerComponentPortal = new ComponentPortal(SimpleColorPickerComponent);
  }

  deleteColor(index) {
    this.option.splice(index, 1);
    this._propagateChange([...this.option]);
  }

  displayMenu() {
    // Create ComponentPortal that can be attached to a PortalHost

    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    } else {
      this.componentRef = this.overlayRef.attach(new ComponentPortal(SimpleColorPickerComponent));
      this.componentRef.instance.output.subscribe((value) => {
        if (this.option) {
          this.option.push(value);
        } else {
          this.option = [value];
        }
        this._propagateChange([...this.option]);
        console.log(value);
      });
    }
  }

  ngAfterViewInit() {
  }
}
