import * as _ from 'lodash';

import {CommentGraphic} from '../../graphic/design/auxiliary/comment.graphic';
import {Auxiliary} from '@core/node/graphic.view/auxiliary/auxiliary';
import {CommentConfigComponent} from '../../../../components/graphic.config/auxiliary/comment.config.component';

interface CommentOption {
  text?: string;
  backgroundColor?: string;
}

const OptionDefault: CommentOption = {
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
  $element: JQuery;
  private _$editor: JQuery;
  private _option: CommentOption = {};

  private _editorInstance: any;
  private _creating = false;

  constructor(private _commentGraphic: CommentGraphic) {
    super();
    this.$element = $(CommentTemplate);
    this._$editor = this.$element.find('.medium-editor-element');
    _commentGraphic.addChild(this);
  }

  init(option: CommentOption) {
    this._option = _.defaultsDeep(option, OptionDefault);
    this._refresh();
  }

  resize() {

  }

  update(option: any) {
    this._option = _.defaultsDeep(option, this._option);
    this._refresh();
  }

  activate() {
    if (!this._editorInstance && !this._creating) {
      this._creating = true;
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
          this._creating = false;
          this._editorInstance = editor;
          editor.setData(this._option.text);
          console.log('Editor was initialized', Array.from(editor.ui.componentFactory.names()), editor);
        })
        .catch(error => {
          this._creating = false;
          console.error(error);
        });
    }
  }

  deactivate() {
    if (this._editorInstance) {
      this._option.text = this._editorInstance.getData();
      document.getSelection().removeAllRanges();
    }

  }

  destroy() {
    if (this._editorInstance) {
      this._editorInstance.destroy();
      this._editorInstance = null;
    }
  }

  private _refresh() {
  }
}
