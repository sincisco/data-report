import {ComponentRef} from '@angular/core';
import {IGraphic} from '../../graphic';

import {siderLeftComponent} from '../../../../../layout/sider/sider.left.component';

import {TextAuxiliary} from '../../../graphic.view/auxiliary/text.auxiliary';
import {DesignConfigSource} from '../../../source/config.source/design.config.source';
import {TextConfigComponent} from '../../../../../components/graphic.config/auxiliary/text.config.component';
import {RegionController} from '../../../region/region.controller';
import {IGraphicView} from '../../../graphic.view/graphic.view';

const template = `
<div class="graphic m-graphic m-graphic-text z-mode-edit">
  <div class="frame" style="border: 0px solid rgb(204, 204, 204); background-color: rgba(1, 1, 1, 0); border-radius: 0px; opacity: 1;">
  </div>
</div>
`;

export class TextGraphic implements IGraphic {
  $element: JQuery;

  private _view: IGraphicView;
  private _configComponentRef: ComponentRef<DesignConfigSource>;

  constructor(private _region: RegionController) {
    this.$element = $(template);
    _region.addChild(this);
  }

  get configSource() {
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
      this.configSource.importOption(option);
    }
    this._view.addEventListener('textChanged', (text) => {
      console.log(text);
      this.configSource.importOption({text});
    });
  }

  getOption() {
    return {
      graphicClass: 'text.graphic',
      option: this.configSource.exportOption()
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