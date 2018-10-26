import {IGraphic} from '@core/node/graphic/graphic';
import {DefaultGraphicView} from '@core/node/graphic.view/default.graphic.view';

const TextTemplate = `<div class="m-rect m-rect-text"
 style="color: rgb(51, 51, 51); font-size: 12px; font-family: avenir, Helvetica, Arial, sans-serif; 
 background: rgba(1, 1, 1, 0); border-radius: 0px; overflow-y: visible;">
  <div class="editor-wrap">
    <div class="editor medium-editor-element"
    contenteditable="true"
    spellcheck="false"
    role="textbox" aria-multiline="true" data-placeholder="请输入文本" style="vertical-align: top;"></div>
  </div>
</div>
`;

/**
 * region 高度自适应
 */
export class TextAuxiliary extends DefaultGraphicView {
  $element: JQuery;
  private _$editor: JQuery;

  private _creating = false;
  private _editor: any;
  private _cache: any;

  constructor(private _graphic: IGraphic) {
    super();
    this.$element = $(TextTemplate);
    this._$editor = this.$element.find('.medium-editor-element');
  }


  update(option: any) {
    if (option.text) {
      // 被激活过
      if (this._editor) {
        this._editor.setData(option.text);
      } else if (this._creating) {
        this._cache = option;
      } else {
        this._$editor.html(option.text);
      }
    }
  }

  activate() {
    if (!this._editor && !this._creating) {
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
          this._editor = editor;
          if (this._cache && this._cache.text) {
            editor.setData(this._cache.text);
          }
          console.log('Editor was initialized',
            Array.from(editor.ui.componentFactory.names()));
        })
        .catch(error => {
          this._creating = false;
          console.error(error);
        });
    }
  }

  deactivate() {
    if (this._editor) {
      this._event.dispatchEvent('textChanged', this._editor.getData());
      document.getSelection().removeAllRanges();
    }
  }

  destroy() {
    super.destroy();
    if (this._editor) {
      this._editor.destroy();
      this._editor = null;
    }
    if (this.$element) {
      this.$element.remove();
      this.$element = null;
    }
  }
}
