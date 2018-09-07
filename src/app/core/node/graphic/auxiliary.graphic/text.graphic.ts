import {ComponentRef, Type} from '@angular/core';
import {IGraphic} from '../graphic';

import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';

import * as _ from 'lodash';
import {TextAuxiliary} from '@core/node/graphic.view/auxiliary/text.auxiliary';
import {ConfigModel} from '../../../../components/graphic.config/graphic.config';
import {TextConfigComponent} from '../../../../components/graphic.config/auxiliary/text.config.component';
import {RegionController} from '@core/node/region/region.controller';
import {IGraphicView} from '@core/node/graphic.view/graphic.view';

const template = `
<div class="graphic m-graphic m-graphic-text z-mode-edit">
  <div class="frame" style="border: 0px solid rgb(204, 204, 204); background-color: rgba(1, 1, 1, 0); border-radius: 0px; opacity: 1;">
  </div>
</div>
`;

export class TextGraphic implements IGraphic {
  $element: JQuery;
  private _$frame: JQuery;

  private _content: IGraphicView;
  private _configComponentRef: ComponentRef<ConfigModel>;

  constructor(private _region: RegionController) {
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');

    _region.addChild(this);
  }

  get configModel() {
    return this._configComponentRef ? this._configComponentRef.instance : null;
  }


  addChild(textAuxiliary: TextAuxiliary) {
    this._content = textAuxiliary;
    this._$frame.append(textAuxiliary.$element);
  }

  init(option?: any) {
    this._content = new TextAuxiliary(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(TextConfigComponent);
    if (option) {
      this.configModel.writeOption(option);
    }
    this._content.init({});
    this.configModel.graphic = this;
  }

  load(option?: any) {
    option = _.defaultsDeep(option || {}, this._configComponentRef.instance.option);
    this._content.init(option);
  }

  getOption() {
    return {
      graphicClass: 'text.graphic',
      option: this.configModel.readOption()
    };
  }

  update(option: any) {
    if (this._content) {
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
      (<any>this._content).deactivate();
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
