import {ComponentRef} from '@angular/core';

import {siderLeftComponent} from '../../../../../layout/sider/sider.left.component';

import * as _ from 'lodash';
import {ImageAuxiliary} from '../../../graphic.view/auxiliary/image.auxiliary';
import {DesignerConfigSource} from '../../../source/config.source/designer.config.source';
import {ImageConfigComponent} from '../../../../../components/graphic.config/auxiliary/image.config.component';
import {IGraphicView} from '../../../graphic.view/graphic.view';
import {RegionController} from '../../../region/region.controller';
import {DesignerGraphic} from '../designer.graphic';


const template = `
<div class="graphic m-graphic m-graphic-image z-mode-edit">
  <div class="frame"
  style="border: 0px solid rgb(204, 204, 204); background-color: rgba(255, 255, 255, 0); border-radius: 0px; opacity: 1;">
  </div>
</div>
`;

export class ImageGraphic extends DesignerGraphic {
  $element: JQuery;
  private _$frame: JQuery;

  private _view: IGraphicView;
  private _configComponentRef: ComponentRef<DesignerConfigSource>;

  constructor(private _region: RegionController) {
    super();
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');
    _region.addChild(this);
  }

  get model() {
    return this._configComponentRef.instance;
  }

  addChild(imageAuxiliary: ImageAuxiliary) {
    this._view = imageAuxiliary;
    this._$frame.append(imageAuxiliary.$element);
  }

  init(option?: any, runtime?: boolean) {
    if (runtime) {

    } else {
      this._view = new ImageAuxiliary(this);
      this._configComponentRef = siderLeftComponent
        .forwardCreateGraphicConfig(ImageConfigComponent);
      if (option) {
        this.model.importOption(option);
      }
      this._initForUpdate(!!option);
    }
  }

  private _initForUpdate(load?: boolean) {
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


  getOption() {
    return {
      graphicClass: 'image.graphic',
      option: this.model.exportOption()
    };
  }

  update(option: any) {
    if (this._view && option && option.dataUrl) {
      this._region.setDimensions(option.width, option.height);
      this._view.update(option);
    }
  }

  updateTheme(theme: string) {
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
      this._view = null;
      this._configComponentRef.destroy();
      this._configComponentRef = null;
    }
    this.$element.remove();
    this.$element = null;
  }
}
