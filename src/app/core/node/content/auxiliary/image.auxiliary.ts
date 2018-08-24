import * as _ from 'lodash';

import {Auxiliary} from '@core/node/content/auxiliary/auxiliary';
import {ImageGraphic} from '@core/node/graphic/auxiliary.graphic/image.graphic';
import {ImageConfigComponent} from '../../../../components/graphic.config/auxiliary/image.config.component';

interface ImageOption {
  alt?: string;
  backgroundColor?: string;
  align?: 'left' | 'right' | 'center' | 'justify';
  dataUrl?: string;
}


export class ImageAuxiliary extends Auxiliary {
  $element: JQuery;
  private _option: ImageOption;


  private _image: HTMLImageElement;

  configClass = ImageConfigComponent;

  constructor(imageGraphic: ImageGraphic) {
    super();
    this.$element = $(`<div class="m-image"></div>`);
    imageGraphic.addChild(this);
  }

  init(option: ImageOption) {
    if (!this._image) {
      const image = this._image = document.createElement('img');
      image.alt = 'Image preview...';
      this.$element.append(image);
    }

    if (this._option.dataUrl) {
      this._image.src = this._option.dataUrl;
    }
  }

  resize() {

  }

  update(option: any) {
    if (!this._image) {
      const image = document.createElement('img');
      // image.alt = this._option.alt;
      this._image = image;
      this.$element.append(image);
    }

    this._option = _.defaultsDeep(option, this._option);
    if (this._option.dataUrl) {
      this._image.src = this._option.dataUrl;
    }
  }

  activate() {
  }

  destroy() {
  }
}


