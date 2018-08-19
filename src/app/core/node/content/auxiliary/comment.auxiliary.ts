import * as _ from 'lodash';

import {CommentConfigComponent} from '../../../../layout/sider/graphic.config/auxiliary/comment.config.component';
import {CommentGraphic} from '../../graphic/comment.graphic';
import {Auxiliary} from '@core/node/content/auxiliary/auxiliary';

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

const CommentTemplate = `
<div class="m-rect m-rect-comment">
<div class="icon top left" style="background: rgb(255, 193, 7);">!</div>
<div class="tooltip top left ">
  <div class="editor-wrap">
    <div class="editor medium-editor-element" spellcheck="true"
        data-placeholder="请输入文本" style="color: rgb(0, 0, 0); vertical-align: top;"></div>
  </div>
</div>
</div>
`;


export class CommentAuxiliary extends Auxiliary {
  private _option: ParagraphOption;
  private _$element: JQuery;
  private _$editor: JQuery;
  configClass = CommentConfigComponent;

  constructor(private _commentGraphic: CommentGraphic) {
    super();
    this._$element = $(CommentTemplate);
    this._$editor = this._$element.find('.medium-editor-element');
    this._commentGraphic.$element.click(() => {
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
  }

  private state = false;

  activate() {
    console.log('TextAuxiliary active ');
    if (!this.state) {
      BalloonEditor
        .create(this._$editor[0], {
          toolbar: ['bold', 'italic', 'link', '|', 'bulletedList', 'numberedList', 'blockQuote'],
          fontSize: [10, 12, 14, 16, 20, 24, 36]
        })
        .catch(error => {
          console.error(error);
        });
      this.state = true;
    }
  }

  destroy() {

  }
}
