import {ComponentRef} from '@angular/core';
import {IGraphic} from '../graphic';

import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';

import * as _ from 'lodash';
import {ExplicitRegion} from '../../region/explicit.region';
import {ChangeItem, ChangeManager} from '../../utils/change.manager';
import {ImageAuxiliary} from '@core/node/content/auxiliary/image.auxiliary';
import {ConfigModel} from '../../../../components/graphic.config/graphic.config';
import {ImageConfigComponent} from '../../../../components/graphic.config/auxiliary/image.config.component';


const template = `
<div class="graphic m-graphic m-graphic-image z-mode-edit">
  <div class="frame"
  style="border: 0px solid rgb(204, 204, 204); background-color: rgba(255, 255, 255, 0); border-radius: 0px; opacity: 1;">
  </div>
</div>
`;

export class ImageGraphic extends ChangeManager implements IGraphic {
  $element: JQuery;
  private _$frame: JQuery;

  private _region: ExplicitRegion;
  private _content: IContent;
  private _configComponentRef: ComponentRef<ConfigModel>;

  constructor(region: ExplicitRegion) {
    super();
    this._region = region;
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');
    region.addChild(this);

    this._initForUpdate();
  }

  get configModel() {
    return this._configComponentRef.instance;
  }

  addChild(imageAuxiliary: ImageAuxiliary) {
    this._content = imageAuxiliary;
    this._$frame.append(imageAuxiliary.$element);
  }

  init(option?: any) {
    this._content = new ImageAuxiliary(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(ImageConfigComponent);
    this.configModel.graphic = this;
    if (option) {
      this.configModel.writeOption(option);
    }
  }

  getOption() {
    return {
      graphicClass: 'image.graphic',
      option: this.configModel.readOption()
    };
  }

  private _initForUpdate() {
    this.register('add.borderRadius borderRadius', (key, oldValue, newValue) => {
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
    if (this._content && option && option.dataUrl) {
      this._region.setDimensions(option.width, option.height);
      this._content.update(option);
    }
  }

  updateTheme(theme: string) {
  }

  updateGraphic(changeItemArray: Array<ChangeItem>) {
    changeItemArray.forEach((value, index, array) => {
      this.trigger(value);
    });
  }

  incrementalUpdate(changeItemArray: Array<ChangeItem>) {

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
