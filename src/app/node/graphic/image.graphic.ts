import {ComponentRef, Type} from '@angular/core';
import {Region} from '../region/region';
import {IGraphic} from './graphic';
import {Chart} from '../content/chart/chart';

import {GraphicConfig} from '../../layout/sider/graphic.config/graphic.config';
import {siderLeftComponent} from '../../layout/sider/sider.left.component';

import * as _ from 'lodash';
import {HtmlNode} from '../content/html/html';

const template = `
<div class="graphic m-graphic m-graphic-image z-mode-edit">
  <div class="frame"
  style="border: 0px solid rgb(204, 204, 204); background-color: rgba(255, 255, 255, 0); border-radius: 0px; opacity: 1;">
  </div>
</div>
`;

export class HtmlGraphic implements IGraphic {
  $element: JQuery;
  private _$frame: JQuery;

  private _region: Region;
  private _html: HtmlNode;
  private _configComponentRef: ComponentRef<GraphicConfig>;

  constructor(region: Region) {
    this._region = region;
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');
    region.$fill.append(this.$element);
  }

  childHost(): JQuery {
    return this._$frame;
  }

  init(contentClass: Type<HtmlNode>) {
    this._html = new contentClass(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(this._html.configClass);
    this._configComponentRef.instance.graphic = this;
  }

  load(option?: any) {
    option = _.defaultsDeep(option || {}, this._configComponentRef.instance.option);
    this._html.init(option);
  }

  update(option: any) {
    if (this._html) {
      this._html.update(option);
    }
  }

  resize() {
    if (this._html) {
      this._html.resize();
    }
  }

  activate() {
    if (!this._configComponentRef) {
      this._configComponentRef = siderLeftComponent.createGraphicConfig(this._html.configClass);
      this._configComponentRef.instance.graphic = this;
    } else {
      siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
    }
    if (this._html) {
      this._html.activate();
    }
  }

  destroy() {
    if (this._html) {
      this._html.destroy();
      this._configComponentRef.destroy();
    }
  }

}
