import {
  Component, forwardRef,
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

import {CustomControlValueAccessor} from '../config/CustomControlValueAccessor';

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
    alt: '我是标题',
    fileName: null,
    url: null,
    dataUrl: null,
    width: 0,
    height: 0
  };


  constructor() {
    super();
  }

  change(event: Event) {
    const that = this;
    const file: HTMLInputElement = <HTMLInputElement>event.currentTarget;
    if (!file.files || !file.files[0]) {
      return;
    }
    this.option.fileName = file.files[0].name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      this.option.dataUrl = (<any>evt.target).result;
      const image = new Image();
      image.src = (<any>evt.target).result;
      image.onload = function () {
        that.option.width = (<HTMLImageElement>this).naturalWidth;
        that.option.height = (<HTMLImageElement>this).naturalHeight;
        that._propagateChange(Object.assign({}, that.option));
      };

    };
    reader.readAsDataURL(file.files[0]);
  }
}
