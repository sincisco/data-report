import {Observable, Subscription} from 'rxjs';
import {ImageAuxiliary} from '../../graphic.view/auxiliary/image.auxiliary';
import {IGraphicView} from '../../graphic.view/graphic.view';
import {DefaultGraphic} from '../default.graphic';
import {RegionController} from '@core/node/region/region.controller';
import * as _ from 'lodash';

const template = `
<div class="graphic m-graphic m-graphic-image z-mode-edit">
  <div class="frame"
  style="border: 0px solid rgb(204, 204, 204); background-color: rgba(255, 255, 255, 0); border-radius: 0px; opacity: 1;">
  </div>
</div>
`;

export class ImageGraphic extends DefaultGraphic {
  $element: JQuery;

  constructor() {
    super();
    this.$element = $(template);
  }

  init(region: RegionController) {
    this._view = new ImageAuxiliary(this);
    this.$element.find('.frame').append(this._view.$element);

    const $frame = this.$element.find('.frame');
    this._modelEventTarget
      .register('add.borderRadius borderRadius', (key, oldValue, newValue) => {
        $frame.css({
          'borderRadius': newValue
        });
      }).register('add.borderWidth borderWidth', (key, oldValue, newValue) => {
      $frame.css({
        'borderWidth': newValue
      });
    }).register('add.borderColor borderColor', (key, oldValue, newValue) => {
      $frame.css({
        'borderColor': newValue
      });
    }).register('add.borderStyle borderStyle', (key, oldValue, newValue) => {
      $frame.css({
        'borderStyle': newValue
      });
    }).register('add.backgroundColor backgroundColor', (key, oldValue, newValue) => {
      $frame.css({
        'backgroundColor': newValue
      });
    }).register('add.image image', (key, oldValue, newValue) => {
      if (this._view && newValue && newValue.dataUrl) {
        region.setDimensions(newValue.width, newValue.height);
        this._view.update(newValue);
      }
    });
  }

  accept(modelSource: Observable<any>): Subscription {
    let lastConfig;
    return modelSource.subscribe((modelArray: Array<any>) => {
      console.log('model change');
      const [config, data] = modelArray;
      if (!!config && config !== lastConfig) {
        console.log('config change', JSON.stringify(config));
        if (_.isArray(config)) {
          this._modelEventTarget.batchTrigger(config);
        } else {
          this._modelEventTarget.trigger(config);
        }
        lastConfig = config;
      }
    });
  }

  private _initForUpdate() {

  }

}
