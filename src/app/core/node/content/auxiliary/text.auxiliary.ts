import * as _ from 'lodash';
import {HtmlNode} from '../html/html';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';
import {TextConfigComponent} from '../../../../layout/sider/graphic.config/auxiliary/text.config.component';
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
      //return false;
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
          toolbar: ['heading', '|', 'bold', 'italic', 'fontFamily', 'fontSize', 'highlight', 'bulletedList', 'numberedList', 'alignment'],
          fontSize: [10, 12, 14, 16, 20, 24, 36],
          highlight: {
            options: [
              {
                model: 'yellowMarker',
                class: 'marker-yellow',
                title: 'Yellow marker',
                color: 'var(--ck-highlight-marker-yellow)',
                type: 'marker'
              },
              {
                model: 'greenMarker',
                class: 'marker-green',
                title: 'Green marker',
                color: 'var(--ck-highlight-marker-green)',
                type: 'marker'
              },
              {
                model: 'pinkMarker',
                class: 'marker-pink',
                title: 'Pink marker',
                color: 'var(--ck-highlight-marker-pink)',
                type: 'marker'
              },
              {
                model: 'blueMarker',
                class: 'marker-blue',
                title: 'Blue marker',
                color: 'var(--ck-highlight-marker-blue)',
                type: 'marker'
              },
              {
                model: 'whiteMarker',
                class: 'marker-white',
                title: 'White marker',
                color: 'var(--ck-highlight-marker-white)',
                type: 'marker'
              },
              {
                model: 'redPen',
                class: 'pen-red',
                title: 'Red pen',
                color: 'var(--ck-highlight-pen-red)',
                type: 'pen'
              },
              {
                model: 'greenPen',
                class: 'pen-green',
                title: 'Green pen',
                color: 'var(--ck-highlight-pen-green)',
                type: 'pen'
              },
              {
                model: 'whitePen',
                class: 'pen-white',
                title: 'White pen',
                color: 'var(--ck-highlight-pen-white)',
                type: 'pen'
              }
            ]
          }
        })
        .then(editor => {
          console.log('Editor was initialized', Array.from(editor.ui.componentFactory.names()), editor);
        })
        .catch(error => {
          console.error(error);
        });
      this.state = true;
    }
  }

  deactivate() {
    console.log('deactivate');
    document.getSelection().removeAllRanges();
    // this._$editor[0].blur();
  }
}
