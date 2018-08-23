import {ComponentRef, Type} from '@angular/core';
import {IGraphic} from '../graphic';

import {ConfigModel} from '../../../../layout/sider/graphic.config/graphic.config';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';

import * as _ from 'lodash';
import {HtmlNode} from '../../content/html/html';
import {CommentRegion} from '../../region/comment.region';
import {CommentAuxiliary} from '@core/node/content/auxiliary/comment.auxiliary';
import {CommentConfigComponent} from '../../../../layout/sider/graphic.config/auxiliary/comment.config.component';
import {Auxiliary} from '@core/node/content/auxiliary/auxiliary';
import {Region} from '@core/node/region/region';

const template = `
<div class="graphic m-graphic m-graphic-comment z-mode-edit">
<div class="frame" style="border: 0px solid rgb(204, 204, 204); background-color: rgba(1, 1, 1, 0); border-radius: 0px; opacity: 1;">
</div>
</div>
`;

export abstract class AuxiliaryGraphic implements IGraphic {
  $element: JQuery;
  private _$frame: JQuery;

  private region: Region;
  protected auxiliary: Auxiliary;
  private _configComponentRef: ComponentRef<ConfigModel>;

  protected constructor(region: CommentRegion) {

  }

  abstract addChild(auxiliary: Auxiliary);

  abstract init(option?: any);

  abstract update(option: any);

  updateTheme(theme: string) {
  }

  updateGraphic(option: any) {

  }

  getOption() {
  }

  resize() {
    if (this.auxiliary) {
      this.auxiliary.resize();
    }
  }

  activate() {
    if (this.auxiliary) {
      this.auxiliary.activate();
    }
  }

  deactivate() {
    if (this.auxiliary) {
      this.auxiliary.deactivate();
    }
  }

  activateConfig() {
    if (this._configComponentRef) {
      siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
    }
  }

  render() {
  }

  derender() {
  }

  destroy() {
    if (this.auxiliary) {
      this.auxiliary.destroy();
      this._configComponentRef.destroy();
    }
  }

}
