import {ComponentRef, Type} from '@angular/core';
import {IGraphic} from '../graphic';

import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';

import * as _ from 'lodash';
import {TextAuxiliary} from '@core/node/graphic.view/auxiliary/text.auxiliary';
import {GraphicConfig} from '../../../../components/graphic.config/graphic.config';
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

  private _view: IGraphicView;
  private _configComponentRef: ComponentRef<GraphicConfig>;

  constructor(private _region: RegionController) {
    this.$element = $(template);
    _region.addChild(this);
  }

  get model() {
    return this._configComponentRef ? this._configComponentRef.instance : null;
  }

  addChild(textAuxiliary: TextAuxiliary) {
    this._view = textAuxiliary;
    this.$element.find('.frame').append(textAuxiliary.$element);
  }

  init(option?: any) {
    this._view = new TextAuxiliary(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(TextConfigComponent);
    if (option) {
      this.model.importOption(option);
    }
    this._view.addEventListener('textChanged', (text) => {
      console.log(text);
      this.model.importOption({text});
    });
    this._view.init({text: option ? option.text : ''});
    this.model.graphic = this;
  }

  getOption() {
    return {
      graphicClass: 'text.graphic',
      option: this.model.exportOption()
    };
  }

  update(option: any) {
    if (this._view) {
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
      (<any>this._view).deactivate();
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
