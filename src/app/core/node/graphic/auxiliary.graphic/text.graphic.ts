import {ComponentRef, Type} from '@angular/core';
import {IGraphic} from '../graphic';

import {ConfigModel} from '../../../../layout/sider/graphic.config/graphic.config';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';

import * as _ from 'lodash';
import {HtmlNode} from '../../content/html/html';
import {ExplicitRegion} from '../../region/explicit.region';
import {TextAuxiliary} from '@core/node/content/auxiliary/text.auxiliary';
import {TextConfigComponent} from '../../../../layout/sider/graphic.config/auxiliary/text.config.component';

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
  private _content: IContent;
  private _configComponentRef: ComponentRef<ConfigModel>;

  constructor(region: ExplicitRegion) {
    this._region = region;
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');
    region.addChild(this);
  }

  get model(): ConfigModel {
    return this._configComponentRef.instance;
  }

  addChild(textAuxiliary: TextAuxiliary) {
    this._content = textAuxiliary;
    this._$frame.append(textAuxiliary.$element);
  }

  init(option: any) {
    this._content = new TextAuxiliary(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(TextConfigComponent);
    if (option) {
      this.model.writeOption(option);
    }
    this.model.graphic = this;
  }

  load(option?: any) {
    option = _.defaultsDeep(option || {}, this._configComponentRef.instance.option);
    this._content.init(option);
  }

  getOption() {
  }

  render() {
  }

  derender() {
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

  activateConfig() {
    if (this._configComponentRef) {
      siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
    }

  }

  deactivate() {
    if (this._content) {
      (<any>this._content).deactivate();
    }
  }

  destroy() {
    if (this._content) {
      this._content.destroy();
      this._configComponentRef.destroy();
    }
  }

}
