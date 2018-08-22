import {ComponentRef, Type} from '@angular/core';
import {Region} from '../region/region';
import {IGraphic} from './graphic';
import {Chart} from '../content/chart/chart';

import {GraphicConfig} from '../../../layout/sider/graphic.config/graphic.config';
import {siderLeftComponent} from '../../../layout/sider/sider.left.component';

import * as _ from 'lodash';
import {HtmlNode} from '../content/html/html';
import {ExplicitRegion} from '../region/explicit.region';
import {ChangeItem, ChangeManager} from '@core/node/utils/ChangeManager';

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
  private _html: HtmlNode;
  private _configComponentRef: ComponentRef<GraphicConfig>;

  constructor(region: ExplicitRegion) {
    super();
    this._region = region;
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');
    region.addChild(this);

    this._initForUpdate();
  }

  childHost(): JQuery {
    return this._$frame;
  }

  init(contentClass: Type<HtmlNode>) {
    this._html = new contentClass(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(this._html.configClass);
    this._configComponentRef.instance.graphic = this;
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
    });
  }

  load(option?: any) {
    option = _.defaultsDeep(option || {}, this._configComponentRef.instance.option);
    this._html.init(option);
  }

  update(option: any) {
    if (this._html && option) {
      this._region.setDimensions(option.width, option.height);
      this._html.update(option);
    }
  }

  updateTheme(theme: string) {
  }

  updateGraphic(changeItemArray: Array<ChangeItem>) {
    changeItemArray.forEach((value, index, array) => {
      this.trigger(value);
    });
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

  deactivate() {
    if (this._html) {
      (<any>this._html).deactivate();
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
