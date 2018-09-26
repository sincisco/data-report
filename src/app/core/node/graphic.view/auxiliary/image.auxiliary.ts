import {Auxiliary} from '@core/node/graphic.view/auxiliary/auxiliary';
import {ImageGraphic} from '@core/node/graphic/designer/auxiliary.graphic/image.graphic';

interface ImageOption {
  alt?: string;
  backgroundColor?: string;
  dataUrl?: string;
}


export class ImageAuxiliary extends Auxiliary {
  $element: JQuery;
  private _option: ImageOption;

  private _image: HTMLImageElement;

  constructor(private imageGraphic: ImageGraphic) {
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

    if (this._option && option.dataUrl) {
      this._image.src = option.dataUrl;
    }
  }

  update(option: any) {
    if (!this._image) {
      const image = document.createElement('img');
      // image.alt = this._option.alt;
      this._image = image;
      this.$element.append(image);
    }

    if (option.dataUrl) {
      this._image.src = option.dataUrl;
    }
  }

  destroy() {
    this.imageGraphic = null;
    this.$element.remove();
    this.$element = null;
  }
}


