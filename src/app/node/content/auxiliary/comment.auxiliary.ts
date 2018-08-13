import * as _ from 'lodash';

import {siderLeftComponent} from '../../../layout/sider/sider.left.component';
import {TextConfigComponent} from '../../../layout/sider/graphic.config/auxiliary/text.config.component';
import {ImageGraphic} from '../../graphic/image.graphic';
import {TextGraphic} from '../../graphic/text.graphic';
import {HtmlNode} from '../html/html';
import {CommentConfigComponent} from '../../../layout/sider/graphic.config/auxiliary/comment.config.component';
import {CommentGraphic} from '../../graphic/comment.graphic';

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


export class CommentAuxiliary extends HtmlNode {
  private _option: ParagraphOption;
  private _$element: JQuery;
  private _$editor: JQuery;
  configClass = CommentConfigComponent;

  constructor(private _commentGraphic: CommentGraphic) {
    super();
    this._$element = $(`<div class="m-rect m-rect-comment">
<div class="icon top left" style="background: rgb(255, 193, 7);">!</div>
<div class="tooltip top left ">
  <div class="editor-wrap">
    <div class="editor medium-editor-element" spellcheck="true"
        data-placeholder="请输入文本" style="color: rgb(0, 0, 0); vertical-align: top;"></div>
  </div>
</div>
</div>`);
    this._$editor = this._$element.find('.medium-editor-element');
    this._commentGraphic.$element.click(() => {
      console.log('container123');
      return false;
    });
    _commentGraphic.childHost().append(this._$element);
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
