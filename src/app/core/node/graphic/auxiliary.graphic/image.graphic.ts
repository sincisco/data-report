import {ComponentRef} from '@angular/core';
import {IGraphic} from '../graphic';

import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';

import * as _ from 'lodash';
import {ChangeItem, ModelEventTarget} from '../../event/model.event';
import {ImageAuxiliary} from '@core/node/graphic.view/auxiliary/image.auxiliary';
import {GraphicConfig} from '../../../../components/graphic.config/graphic.config';
import {ImageConfigComponent} from '../../../../components/graphic.config/auxiliary/image.config.component';
import {IGraphicView} from '@core/node/graphic.view/graphic.view';
import {RegionController} from '@core/node/region/region.controller';


const template = `
<div class="graphic m-graphic m-graphic-image z-mode-edit">
  <div class="frame"
  style="border: 0px solid rgb(204, 204, 204); background-color: rgba(255, 255, 255, 0); border-radius: 0px; opacity: 1;">
  </div>
</div>
`;

export class ImageGraphic extends ModelEventTarget implements IGraphic {
  $element: JQuery;
  private _$frame: JQuery;

  private _region: RegionController;
  private _view: IGraphicView;
  private _configComponentRef: ComponentRef<GraphicConfig>;

  constructor(region: RegionController) {
    super();
    this._region = region;
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');
    region.addChild(this);
  }

  get model() {
    return this._configComponentRef.instance;
  }

  addChild(imageAuxiliary: ImageAuxiliary) {
    this._view = imageAuxiliary;
    this._$frame.append(imageAuxiliary.$element);
  }

  init(option?: any) {
    this._view = new ImageAuxiliary(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(ImageConfigComponent);
    this.model.graphic = this;
    if (option) {
      this.model.importOption(option);
    }
    this._initForUpdate();
  }

  getOption() {
    return {
      graphicClass: 'image.graphic',
      option: this.model.exportOption()
    };
  }

  private _initForUpdate() {
    this.model.register('add.borderRadius borderRadius', (key, oldValue, newValue) => {
      this._$frame.css({
        'borderRadius': newValue
      });
    }).register('add.borderWidth borderWidth', (key, oldValue, newValue) => {
      this._$frame.css({
        'borderWidth': newValue
      });
    }).register('add.borderColor borderColor', (key, oldValue, newValue) => {
      this._$frame.css({
        'borderColor': newValue
      });
    }).register('add.borderStyle borderStyle', (key, oldValue, newValue) => {
      this._$frame.css({
        'borderStyle': newValue
      });
    }).register('add.backgroundColor backgroundColor', (key, oldValue, newValue) => {
      this._$frame.css({
        'backgroundColor': newValue
      });
    }).register('add.image image', (key, oldValue, newValue) => {
      this.update(newValue);
    });
  }


  update(option: any) {
    if (this._view && option && option.dataUrl) {
      this._region.setDimensions(option.width, option.height);
      this._view.update(option);
    }
  }

  updateTheme(theme: string) {
  }

  updateGraphic(changeItemArray: Array<ChangeItem>) {
    changeItemArray.forEach((value, index, array) => {
      this.trigger(value);
    });
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
      this._view = null;
      this._configComponentRef = null;
    }
    this.$element.remove();
    this.$element = null;

  }

}
