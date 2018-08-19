import * as _ from 'lodash';
import {HtmlNode} from './html';
import {ImageConfigComponent} from '../../../../layout/sider/graphic.config/html/image.config.component';
import {ImageGraphic} from '../../graphic/image.graphic';

interface ImageOption {
  alt?: string;
  backgroundColor?: string;
  align?: 'left' | 'right' | 'center' | 'justify';
  dataUrl?: string;
}

const OptionDefault: ImageOption = {
  alt: 'Image preview...',
  align: 'left',
  backgroundColor: 'transparent'
};


export class ImageHtml extends HtmlNode {
  private _option: ImageOption;
  private _$element: JQuery;

  private _image: HTMLImageElement;

  configClass = ImageConfigComponent;

  constructor(htmlGraphic: ImageGraphic) {
    super();
    this._$element = $(`<div class="m-image"></div>`);
    htmlGraphic.childHost().append(this._$element);
  }

  init(option: ImageOption) {
    if (!this._image) {
      const image = document.createElement('img');
      image.alt = 'Image preview...';
      this._image = image;
      this._$element.append(image);
    }

    this._option = _.defaultsDeep(option, OptionDefault);
    if (this._option.dataUrl) {
      this._image.src = this._option.dataUrl;
    }
    // this._refresh();
  }

  resize() {

  }

  update(option: any) {
    if (!this._image) {
      const image = document.createElement('img');
      image.alt = this._option.alt;
      this._image = image;
      this._$element.append(image);
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


