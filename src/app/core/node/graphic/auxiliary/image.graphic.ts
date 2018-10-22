import {Observable, Subscription} from 'rxjs';
import {ImageAuxiliary} from '../../graphic.view/auxiliary/image.auxiliary';
import {IGraphicView} from '../../graphic.view/graphic.view';
import {DefaultGraphic} from '../default.graphic';


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

  addChild(view: IGraphicView) {
    this._view = view;
    this.$element.find('.frame').append(view.$element);
  }

  init(option?: any) {
    this._view = new ImageAuxiliary(this);
    this._initForUpdate();
  }

  accept(modelSource: Observable<any>): Subscription {
    return modelSource.subscribe((modelArray: Array<any>) => {
      const [config, data] = modelArray;
      console.log(12345, config);
      this._modelEventTarget.batchTrigger(config);
    });
  }

  private _initForUpdate() {
    const $frame = this.$element.find('.frame');
    this._modelEventTarget.register('add.borderRadius borderRadius', (key, oldValue, newValue) => {
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
        // this._region.setDimensions(newValue.width, newValue.height);
        this._view.update(newValue);
      }
    });
  }

}
