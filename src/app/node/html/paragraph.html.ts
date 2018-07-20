import * as _ from 'lodash';
import {HtmlNode} from './html';
import {DataHeaderComponent} from '../../layout/sider/property.data/html/header.component';
import {siderLeftComponent} from '../../layout/sider/sider.left.component';
import {DataParagraphComponent} from '../../layout/sider/property.data/html/paragraph.component';

interface ParagraphOption {
  text?: string;
  backgroundColor?: string;
  align?: 'left' | 'right' | 'center' | 'justify';
}

const OptionDefault: ParagraphOption = {
  text: '我是一个段落',
  align: 'left',
  backgroundColor: 'transparent'
};


export class HtmlParagraph extends HtmlNode {
  private _option: ParagraphOption;
  private _$host: JQuery;
  private _$element: JQuery;
  dataProperty = DataParagraphComponent;

  constructor(private _host: HTMLElement) {
    super();
    this._$host = $(_host);
    console.log(123);
  }

  init(option: ParagraphOption) {
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
    this._$element = $('<p></p>');
    (<HTMLParagraphElement>this._$element[0]).align = option.align;
    this._$host.empty().append(this._$element);
    this._$element.text(option.text);
    this._$element.css({
      'background-color': option.backgroundColor
    });

  }

  activate() {
    siderLeftComponent.createDataProperty(this.dataProperty);
  }
}
