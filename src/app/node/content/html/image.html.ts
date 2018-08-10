import * as _ from 'lodash';
import {HtmlNode} from './html';
import {ImageConfigComponent} from '../../../layout/sider/graphic.config/html/image.config.component';
import {ImageGraphic} from '../../graphic/image.graphic';

interface ImageOption {
  text?: string;
  backgroundColor?: string;
  align?: 'left' | 'right' | 'center' | 'justify';
  dataUrl?: string;
}

const OptionDefault: ImageOption = {
  text: '我是一个段落',
  align: 'left',
  backgroundColor: 'transparent'
};


export class ImageHtml extends HtmlNode {
  private _option: ImageOption;
  private _$image: JQuery;
  private _$element: JQuery;
  configClass = ImageConfigComponent;

  constructor(htmlGraphic: ImageGraphic) {
    super();
    this._$element = $(`<div class="m-image"><img alt="Image preview..."/></div>`);
    this._$image = this._$element.find('img');
    htmlGraphic.childHost().append(this._$element);
  }

  init(option: ImageOption) {
    this._option = _.defaultsDeep(option, OptionDefault);
    if (this._option.dataUrl) {
      (<HTMLImageElement>this._$image[0]).src = this._option.dataUrl;
    }
    // this._refresh();
  }

  resize() {

  }

  update(option: any) {
    this._option = _.defaultsDeep(option, this._option);
    if (this._option.dataUrl) {
      (<HTMLImageElement>this._$image[0]).src = this._option.dataUrl;
    }
  }

  activate() {
  }
}


