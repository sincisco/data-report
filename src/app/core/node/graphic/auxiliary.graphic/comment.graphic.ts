import {ComponentRef} from '@angular/core';
import {IGraphic} from '../graphic';

import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';

import {CommentAuxiliary} from '@core/node/graphic.view/auxiliary/comment.auxiliary';
import {GraphicConfig} from '../../../../components/graphic.config/graphic.config';
import {CommentConfigComponent} from '../../../../components/graphic.config/auxiliary/comment.config.component';
import {IGraphicView} from '@core/node/graphic.view/graphic.view';
import {RegionController} from '@core/node/region/region.controller';

const template = `
<div class="graphic m-graphic m-graphic-comment z-mode-edit">
<div class="frame" style="border: 0px solid rgb(204, 204, 204); background-color: rgba(1, 1, 1, 0); border-radius: 0px; opacity: 1;">
</div>
</div>
`;

export class CommentGraphic implements IGraphic {
  $element: JQuery;
  private _$frame: JQuery;

  private _view: IGraphicView;
  private _configComponentRef: ComponentRef<GraphicConfig>;

  constructor(private _region: RegionController) {
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');

    _region.addChild(this);
  }

  get model() {
    return this._configComponentRef.instance;
  }

  addChild(commentAuxiliary: CommentAuxiliary) {
    this._view = commentAuxiliary;
    this._$frame.append(commentAuxiliary.$element);
  }

  /**
   * 初始化graphic内容
   * @param option
   */
  init(option?: any) {
    this._view = new CommentAuxiliary(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(CommentConfigComponent);
    if (option) {
      this.model.importOption(option);
    }
    this.model.graphic = this;
  }

  getOption() {
    return {
      graphicClass: 'comment.graphic',
      option: this.model.exportOption()
    };
  }


  update(option: any) {
    if (this._view) {
      this._region.setDimensions(option.width, option.height);
      this._view.update(option);
    }
  }

  updateTheme(theme: string) {
  }

  updateGraphic(option: any) {
  }

  resize() {
    if (this._view) {
      this._view.resize();
    }
  }

  activate() {
    if (this._view) {
      this._view.activate();
    }
  }

  deactivate() {
    if (this._view) {
      this._view.deactivate();
    }
  }

  activateConfig() {
    if (this._configComponentRef) {
      siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
    }
  }

  destroy() {
    if (this._view) {
      this._view.destroy();
      this._configComponentRef.destroy();
    }
  }

}
