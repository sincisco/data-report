import * as _ from 'lodash';
import {HtmlNode} from './html';
import {siderLeftComponent} from '../../../layout/sider/sider.left.component';
import {ParagraphConfigComponent} from '../../../layout/sider/graphic.config/html/paragraph.config.component';
import {HtmlGraphic} from '../../graphic/image.graphic';

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


export class ParagraphHtml extends HtmlNode {
  private _option: ParagraphOption;
  private _$host: JQuery;
  private _$element: JQuery;
  configClass = ParagraphConfigComponent;

  constructor(private htmlGraphic: HtmlGraphic) {
    super();
    this._$element = $(`<div id="container123" style="width:100%;height:100%;">这里写你的初始化内容</div>`);
    this.htmlGraphic.$element.click(() => {
      console.log('container123');
      return false;
    });
    htmlGraphic.childHost().append(this._$element);
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
    // const option = this._option;
    // this._$element = $('<p></p>');
    // this._$element = $('<p></p>');
    // (<HTMLParagraphElement>this._$element[0]).align = option.align;
    // this._$host.empty().append(this._$element);
    // this._$element.text(option.text);
    // this._$element.css({
    //   'background-color': option.backgroundColor
    // });

  }

  private state = false;

  activate() {
    console.log('ParagraphHtml active ');
    if (!this.state) {
      BalloonEditor
        .create(document.querySelector('#container123'))
        .catch(error => {
          console.error(error);
        });
      this.state = true;
    }
  }
}
