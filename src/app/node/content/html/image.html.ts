import * as _ from 'lodash';
import {HtmlNode} from './html';
import {siderLeftComponent} from '../../../layout/sider/sider.left.component';
import {ImageConfigComponent} from '../../../layout/sider/graphic.config/html/image.config.component';

interface ImageOption {
  text?: string;
  backgroundColor?: string;
  align?: 'left' | 'right' | 'center' | 'justify';
}

const OptionDefault: ImageOption = {
  text: '我是一个段落',
  align: 'left',
  backgroundColor: 'transparent'
};


export class HtmlImage extends HtmlNode {
  private _option: ImageOption;
  private _$host: JQuery;
  private _$element: JQuery;
  dataProperty = ImageConfigComponent;

  constructor(private _host: HTMLElement) {
    super();
    this._$host = $(_host);
  }

  init(option: ImageOption) {
    this._option = _.defaultsDeep(option, OptionDefault);
    this._refresh();
  }

  resize() {

  }

  update(option: any) {
    this._option = _.defaultsDeep(option, this._option);
    this._refresh();
  }

  private _refresh() {
    const option = this._option;
    this._$element = $(`<input type="file" /><img  src="" width="300px" height="400px" alt="Image preview..."  />`);
    const input = this._$element[0],
      image: HTMLImageElement = (<HTMLImageElement>this._$element[1]);
    $(input).change(($event: JQuery.Event) => {
      const file: HTMLInputElement = <HTMLInputElement>$event.currentTarget;
      if (!file.files || !file.files[0]) {
        return;
      }
      const reader = new FileReader();
      reader.onload = function (evt) {
        console.log('qwerty',(<any>evt.target).result);
        console.log(image);
        image.src = (<any>evt.target).result;
        // image = evt.target.result;
      };
      reader.readAsDataURL(file.files[0]);
    });
    this._$host.empty().append(this._$element);
    this._$element.css({
      'background-color': option.backgroundColor
    });

  }

  activate() {
    siderLeftComponent.createGraphicConfig(this.dataProperty);
  }
}


