import {ComponentRef, Type} from '@angular/core';
import {IGraphic} from './graphic';

import {GraphicConfig} from '../../../layout/sider/graphic.config/graphic.config';
import {siderLeftComponent} from '../../../layout/sider/sider.left.component';

import * as _ from 'lodash';
import {HtmlNode} from '../content/html/html';
import {ExplicitRegion} from '../region/explicit.region';

const template = `
<div class="graphic m-graphic m-graphic-text z-mode-edit">
  <div class="frame" style="border: 0px solid rgb(204, 204, 204); background-color: rgba(1, 1, 1, 0); border-radius: 0px; opacity: 1;">
  </div>
</div>
`;

export class TextGraphic implements IGraphic {
  $element: JQuery;
  private _$frame: JQuery;

  private _region: ExplicitRegion;
  private _html: HtmlNode;
  private _configComponentRef: ComponentRef<GraphicConfig>;

  constructor(region: ExplicitRegion) {
    this._region = region;
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');
    region.addChild(this);
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
      this._region.setDimensions(option.width, option.height);
      this._html.update(option);
    }
  }

  updateTheme(theme: string) {
  }

  updateGraphic(option: any) {

  }

  getOption() {
  }

  resize() {
    if (this._html) {
      this._html.resize();
    }
  }

  activate() {
    if (this._html) {
      this._html.activate();
    }
  }

  activateConfig() {
    if (!this._configComponentRef) {
      this._configComponentRef = siderLeftComponent.createGraphicConfig(this._html.configClass);
      this._configComponentRef.instance.graphic = this;
    } else {
      siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
    }
  }

  deactivate() {
    if (this._html) {
      (<any>this._html).deactivate();
    }
  }

  render() {
  }

  derender() {
  }

  destroy() {
    if (this._html) {
      this._html.destroy();
      this._configComponentRef.destroy();
    }
  }

}
