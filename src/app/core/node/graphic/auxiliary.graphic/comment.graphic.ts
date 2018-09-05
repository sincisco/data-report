import {ComponentRef} from '@angular/core';
import {IGraphic} from '../graphic';


import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';

import {CommentRegion} from '../../region/comment/comment.region';
import {CommentAuxiliary} from '@core/node/graphic.view/auxiliary/comment.auxiliary';
import {ConfigModel} from '../../../../components/graphic.config/graphic.config';
import {CommentConfigComponent} from '../../../../components/graphic.config/auxiliary/comment.config.component';
import {IGraphicView} from '@core/node/graphic.view/graphic.view';

const template = `
<div class="graphic m-graphic m-graphic-comment z-mode-edit">
<div class="frame" style="border: 0px solid rgb(204, 204, 204); background-color: rgba(1, 1, 1, 0); border-radius: 0px; opacity: 1;">
</div>
</div>
`;

export class CommentGraphic implements IGraphic {
  $element: JQuery;
  private _$frame: JQuery;

  private _content: IGraphicView;
  private _configComponentRef: ComponentRef<ConfigModel>;

  constructor(private _region: CommentRegion) {
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');

    _region.addChild(this);
  }

  get configModel() {
    return this._configComponentRef.instance;
  }

  addChild(commentAuxiliary: CommentAuxiliary) {
    this._content = commentAuxiliary;
    this._$frame.append(commentAuxiliary.$element);

  }

  /**
   * 初始化graphic内容
   * @param option
   */
  init(option?: any) {
    this._content = new CommentAuxiliary(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(CommentConfigComponent);
    if (option) {
      this.configModel.writeOption(option);
    }
    this.configModel.graphic = this;
  }

  getOption() {
    return {
      graphicClass: 'comment.graphic',
      option: this.configModel.readOption()
    };
  }


  update(option: any) {
    if (this._content) {
      this._region.setDimensions(option.width, option.height);
      this._content.update(option);
    }
  }

  updateTheme(theme: string) {
  }

  updateGraphic(option: any) {
  }

  resize() {
    if (this._content) {
      this._content.resize();
    }
  }

  activate() {
    if (this._content) {
      this._content.activate();
    }
  }

  deactivate() {
    if (this._content) {
      this._content.deactivate();
    }
  }

  activateConfig() {
    if (this._configComponentRef) {
      siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
    }
  }

  destroy() {
    if (this._content) {
      this._content.destroy();
      this._configComponentRef.destroy();
    }
  }

}
