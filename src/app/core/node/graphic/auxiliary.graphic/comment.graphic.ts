import {ComponentRef} from '@angular/core';
import {IGraphic} from '../graphic';


import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';

import {CommentRegion} from '../../region/comment.region';
import {CommentAuxiliary} from '@core/node/content/auxiliary/comment.auxiliary';
import {ConfigModel} from '../../../../components/graphic.config/graphic.config';
import {CommentConfigComponent} from '../../../../components/graphic.config/auxiliary/comment.config.component';

const template = `
<div class="graphic m-graphic m-graphic-comment z-mode-edit">
<div class="frame" style="border: 0px solid rgb(204, 204, 204); background-color: rgba(1, 1, 1, 0); border-radius: 0px; opacity: 1;">
</div>
</div>
`;

export class CommentGraphic implements IGraphic {
  $element: JQuery;
  private _$frame: JQuery;

  private _region: CommentRegion;
  private _content: IContent;
  private _configComponentRef: ComponentRef<ConfigModel>;

  constructor(region: CommentRegion) {
    this._region = region;
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');
    region.addChild(this);
  }

  get configModel() {
    return this._configComponentRef.instance;
  }

  addChild(commentAuxiliary: CommentAuxiliary) {
    this._content = commentAuxiliary;
    this._$frame.append(commentAuxiliary.$element);

  }

  init(option?: any) {
    this._content = new CommentAuxiliary(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(CommentConfigComponent);
    this._configComponentRef.instance.graphic = this;
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

  getOption() {
  }

  render() {
  }

  derender() {
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
