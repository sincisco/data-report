import {AuxiliaryView} from '@core/node/graphic.view/auxiliary/auxiliary';
import {IGraphic} from '@core/node/graphic/graphic';

interface ImageOption {
  alt?: string;
  backgroundColor?: string;
  dataUrl?: string;
}


export class ImageAuxiliary extends AuxiliaryView {
  $element: JQuery;
  private _image: HTMLImageElement;

  constructor(private graphic: IGraphic) {
    super();
    this.$element = $(`<div class="m-image"></div>`);
  }

  update(option: ImageOption) {
    if (!this._image) {
      this.$element.append(this._image = document.createElement('img'));
    }
    if (option.alt) {
      this._image.alt = option.alt;
    }
    if (option.dataUrl) {
      this._image.src = option.dataUrl;
    }
  }

  destroy() {
    this.graphic = null;
    this.$element.remove();
    this.$element = null;
  }
}


