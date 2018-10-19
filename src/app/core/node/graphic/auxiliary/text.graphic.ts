import {TextAuxiliary} from '../../graphic.view/auxiliary/text.auxiliary';
import {TextConfigComponent} from '../../../../components/graphic.config/auxiliary/text.config.component';
import {RegionController} from '../../region/region.controller';
import {IGraphicView} from '../../graphic.view/graphic.view';
import {DefaultDesignGraphic} from '../default.design.graphic';
import {session} from '../../utils/session';

const template = `
<div class="graphic m-graphic m-graphic-text z-mode-edit">
  <div class="frame" style="border: 0px solid rgb(204, 204, 204); background-color: rgba(1, 1, 1, 0); border-radius: 0px; opacity: 1;">
  </div>
</div>
`;

export class TextGraphic extends DefaultDesignGraphic {
  $element: JQuery;

  constructor(private _region: RegionController) {
    super('text.graphic');
    this.$element = $(template);

    _region.addChild(this);
  }

  addChild(view: IGraphicView) {
    this._view = view;
    this.$element.find('.frame').append(view.$element);
  }

  init(option?: any) {
    this._view = new TextAuxiliary(this);
    this._configComponentRef = session.siderLeftComponent.forwardCreateGraphicConfig(TextConfigComponent);
    this.configSource.register('option', (key, oldValue, newValue) => {
      this.update(newValue);
    });
    if (option) {
      this.configSource.importOption(option);
    }
    this._view.addEventListener('textChanged', (text) => {
      console.log(text);
      this.configSource.importOption({text});
    });
  }

  update(option: any) {
    if (this._view) {
      this._view.update(option);
    }
  }

}
