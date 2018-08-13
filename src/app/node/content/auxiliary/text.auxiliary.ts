import * as _ from 'lodash';
import {HtmlNode} from '../html/html';
import {siderLeftComponent} from '../../../layout/sider/sider.left.component';
import {TextConfigComponent} from '../../../layout/sider/graphic.config/auxiliary/text.config.component';
import {ImageGraphic} from '../../graphic/image.graphic';
import {TextGraphic} from '../../graphic/text.graphic';

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


export class TextAuxiliary extends HtmlNode {
  private _option: ParagraphOption;
  private _$element: JQuery;
  private _$editor: JQuery;
  configClass = TextConfigComponent;

  constructor(private htmlGraphic: TextGraphic) {
    super();
    this._$element = $(`<div class="m-rect m-rect-text"
 style="color: rgb(51, 51, 51); font-size: 12px; font-family: avenir, Helvetica, 'Microsoft YaHei', Arial,
'Hiragino Sans GB', sans-serif; background: rgba(1, 1, 1, 0); border-radius: 0px; overflow-y: visible;">
<div class="editor-wrap">
<div class="editor medium-editor-element"
contenteditable="true"
spellcheck="false"
role="textbox" aria-multiline="true" data-placeholder="请输入文本" style="vertical-align: top;"></div>
</div>
</div>`);
    this._$editor = this._$element.find('.medium-editor-element');
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
    console.log('TextAuxiliary active ');
    if (!this.state) {
      BalloonEditor
        .create(this._$editor[0], {
          toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
          fontSize: [10, 12, 14, 16, 20, 24, 36]
        })
        .catch(error => {
          console.error(error);
        });
      this.state = true;
    }
  }
}
