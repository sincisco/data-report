import {
  Component, forwardRef,
  KeyValueDiffers, NgZone,
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

import {CustomControlValueAccessor} from '../../../components/config/CustomControlValueAccessor';

export const IMAGE_SELECT_CONFIG_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ImageSelectConfigComponent),
  multi: true
};

@Component({
  selector: 'app-image-select',
  templateUrl: './image.select.config.component.html',
  styleUrls: ['./image.select.config.component.less'],
  providers: [IMAGE_SELECT_CONFIG_VALUE_ACCESSOR]
})
export class ImageSelectConfigComponent extends CustomControlValueAccessor {

  option = {
    fileName: null,
    backgroundDataUrl: null
  };


  constructor(private _differs: KeyValueDiffers,
              private _zone: NgZone) {
    super();
  }

  change(event: Event) {
    const file: HTMLInputElement = <HTMLInputElement>event.currentTarget;
    if (!file.files || !file.files[0]) {
      return;
    }
    this.option.fileName = file.files[0].name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      this.option.backgroundDataUrl = (<any>evt.target).result;
      this._propagateChange(Object.assign({}, this.option));
    };
    reader.readAsDataURL(file.files[0]);
  }
}
