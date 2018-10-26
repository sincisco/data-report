import {HtmlNode} from './html';
import * as _ from 'lodash';

import {DataHeaderComponent} from '../../../../components/graphic.config/html/header.component';

interface HeaderOption {
  tag?: string;
  text?: string;
  backgroundColor?: string;
}

const HeaderOptionDefault: HeaderOption = {
  tag: '<h1></h1>',
  text: '标题1',
  backgroundColor: 'transparent'
};


export class HeaderHtml extends HtmlNode {
  private _option: HeaderOption;
  private _$host: JQuery;
  private _$element: JQuery;
  dataProperty = DataHeaderComponent;

  constructor(private _host: HTMLElement) {
    super();
    this._$host = $(_host);
  }

  init(option: HeaderOption) {
    this._option = _.defaultsDeep(option, HeaderOptionDefault);
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
    this._$element = $(option.tag);
    this._$host.empty().append(this._$element);
    this._$element.text(option.text);
    this._$element.css({
      'background-color': option.backgroundColor
    });

  }

  activate() {

  }

  destroy() {

  }
}
