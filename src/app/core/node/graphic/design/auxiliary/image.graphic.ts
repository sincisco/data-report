import {ComponentRef} from '@angular/core';

import {siderLeftComponent} from '../../../../../layout/sider/sider.left.component';

import {ImageAuxiliary} from '../../../graphic.view/auxiliary/image.auxiliary';
import {DesignConfigSource} from '../../../source/config.source/design.config.source';
import {ImageConfigComponent} from '../../../../../components/graphic.config/auxiliary/image.config.component';
import {IGraphicView} from '../../../graphic.view/graphic.view';
import {RegionController} from '../../../region/region.controller';
import {DesignGraphic} from '../design.graphic';


const template = `
<div class="graphic m-graphic m-graphic-image z-mode-edit">
  <div class="frame"
  style="border: 0px solid rgb(204, 204, 204); background-color: rgba(255, 255, 255, 0); border-radius: 0px; opacity: 1;">
  </div>
</div>
`;

export class ImageGraphic extends DesignGraphic {
  $element: JQuery;
  private _$frame: JQuery;

  private _view: IGraphicView;
  private _configComponentRef: ComponentRef<DesignConfigSource>;

  constructor(private _region: RegionController) {
    super();
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');
    _region.addChild(this);
  }

  get configSource() {
    return this._configComponentRef.instance;
  }

  addChild(imageAuxiliary: ImageAuxiliary) {
    this._view = imageAuxiliary;
    this._$frame.append(imageAuxiliary.$element);
  }

  init(option?: any) {
    this._view = new ImageAuxiliary(this);
    this._configComponentRef = siderLeftComponent
      .forwardCreateGraphicConfig(ImageConfigComponent);
    if (option) {
      this.configSource.importOption(option);
    }
    this._initForUpdate(!!option);
  }

  private _initForUpdate(load?: boolean) {
    this.configSource.register('add.borderRadius borderRadius', (key, oldValue, newValue) => {
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
      option: this.configSource.exportOption()
    };
  }

  update(option: any) {
    if (this._view && option && option.dataUrl) {
      this._region.setDimensions(option.width, option.height);
      this._view.update(option);
    }
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
