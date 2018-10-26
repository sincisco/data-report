import {TextAuxiliary} from '../../graphic.view/auxiliary/text.auxiliary';
import {IGraphicView} from '../../graphic.view/graphic.view';
import {DefaultGraphic} from '../default.graphic';
import {Observable, Subscription} from 'rxjs';
import {GraphicWrapper} from '@core/node/graphic/graphic.wrapper';

const template = `
<div class="graphic m-graphic m-graphic-text z-mode-edit">
  <div class="frame" style="border: 0px solid rgb(204, 204, 204); background-color: rgba(1, 1, 1, 0); border-radius: 0px; opacity: 1;">
  </div>
</div>
`;

export class TextGraphic extends DefaultGraphic {
  $element: JQuery;

  private _text: string;

  constructor() {
    super();
    this.$element = $(template);
  }

  init(wrapper: GraphicWrapper) {
    this._view = new TextAuxiliary(this);
    this.$element.find('.frame').append(this._view.$element);
    this._modelEventTarget.register('option', (key, oldValue, newValue) => {
      this.update(newValue);
    });

    const accessor = wrapper.optionAccessor;
    wrapper.optionAccessor = () => {
      return Object.assign(accessor(), {configOption: {text: this._text}});
    };

    this._view.addEventListener('textChanged', (text) => {
      this._text = text;
    });
  }

  accept(modelSource: Observable<any>): Subscription {
    return modelSource.subscribe((modelArray: Array<any>) => {
      const [config, data] = modelArray;
      if (config) {
        this._modelEventTarget.trigger(config);
      }
    });
  }

  update(option: any) {
    if (this._view) {
      this._view.update(option);
    }
  }

}
