const template = `<div class="m-rect m-rect-comment">
  <div class="icon top left" style="background: rgb(255, 193, 7);">!</div>
  <div class="tooltip top left ">
    <div class="editor-wrap">
      <div class="editor medium-editor-element"
      contenteditable="true" spellcheck="true"
      data-medium-editor-element="true"
      role="textbox"
      aria-multiline="true" 
      data-medium-editor-editor-index="1"
      medium-editor-index="5a3b48ad-abc2-c5b5-8488-7210c69982c5"
      data-placeholder="请输入文本" style="color: rgb(0, 0, 0); vertical-align: top;"><p>我是注释</p></div>
    </div>
  </div>
</div>`;

interface CommentOption {
  tag?: string;
  text?: string;
  backgroundColor?: string;
}

export class CommentContent implements IContent {

  private _option: CommentOption;
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

  }

  /**
   * 属性面板发生变化，更新内容
   * @param option
   */
  update(option: any) {

  }

  activate() {

  }

  destroy() {
  }

  getOption() {

  }
}
