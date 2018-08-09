const template = `<div class="m-rect m-rect-text" 
style="color: rgb(51, 51, 51); font-size: 12px; font-family: avenir, Helvetica, &quot;Microsoft YaHei&quot;, Arial, &quot;Hiragino Sans GB&quot;, sans-serif; background: rgba(1, 1, 1, 0); border-radius: 0px; overflow-y: visible;">
  <div class="editor-wrap">
    <div class="editor medium-editor-element" 
    contenteditable="true" spellcheck="false" 
    data-medium-editor-element="true" role="textbox" 
    aria-multiline="true" data-medium-editor-editor-index="3" 
    medium-editor-index="6698f1b2-772d-8d4f-ab9d-733843358000" 
    data-placeholder="请输入文本" style="vertical-align: top;">
    <span class="placeholder">双击以输入文本</span>
    </div>
  </div>
</div>`;

interface TextOption {
  tag?: string;
  text?: string;
  backgroundColor?: string;
}

export class TextContent implements IContent {

  private _option: TextOption;
  private _$host: JQuery;
  private _$element: JQuery;

  constructor(private _host: HTMLElement) {
    this._$host = $(_host);
  }

  init(option: any) {
    this._$element = $(template);
    this._$host.append(this._$element);
  }

  /**
   * 当区域的维度发生变化时，对内容进行重新自适应
   */
  resize() {

  };

  /**
   * 属性面板发生变化，更新内容
   * @param option
   */
  update(option: any) {

  };

  activate() {

  }

  destroy() {
  }

  getOption() {

  }
}
