import {ImageAuxiliary} from '../../graphic.view/auxiliary/image.auxiliary';
import {ImageConfigComponent} from '../../../../components/graphic.config/auxiliary/image.config.component';
import {IGraphicView} from '../../graphic.view/graphic.view';
import {RegionController} from '../../region/region.controller';
import {DefaultGraphic} from '../default.graphic';
import {session} from '../../utils/session';


const template = `
<div class="graphic m-graphic m-graphic-image z-mode-edit">
  <div class="frame"
  style="border: 0px solid rgb(204, 204, 204); background-color: rgba(255, 255, 255, 0); border-radius: 0px; opacity: 1;">
  </div>
</div>
`;

export class ImageGraphic extends DefaultGraphic {
  $element: JQuery;

  constructor(private _region: RegionController) {
    super('image.graphic');
    this.$element = $(template);
  }

  addChild(view: IGraphicView) {
    this._view = view;
    this.$element.find('.frame').append(view.$element);
  }

  init(option?: any) {
    this._view = new ImageAuxiliary(this);
    this._configComponentRef = session.siderLeftComponent
      .forwardCreateGraphicConfig(ImageConfigComponent);
    if (option) {
      this.configSource.importOption(option);
    }
    this._initForUpdate(!!option);
  }

  private _initForUpdate(load?: boolean) {
    const $frame = this.$element.find('.frame');
    this.configSource.register('add.borderRadius borderRadius', (key, oldValue, newValue) => {
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
        this._region.setDimensions(newValue.width, newValue.height);
        this._view.update(newValue);
      }
    });
  }

}
