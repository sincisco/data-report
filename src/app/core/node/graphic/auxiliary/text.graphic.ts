import {TextAuxiliary} from '../../graphic.view/auxiliary/text.auxiliary';
import {IGraphicView} from '../../graphic.view/graphic.view';
import {DefaultGraphic} from '../default.graphic';
import {Observable, Subscription} from 'rxjs';

const template = `
<div class="graphic m-graphic m-graphic-text z-mode-edit">
  <div class="frame" style="border: 0px solid rgb(204, 204, 204); background-color: rgba(1, 1, 1, 0); border-radius: 0px; opacity: 1;">
  </div>
</div>
`;

export class TextGraphic extends DefaultGraphic {
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
    this._view = new TextAuxiliary(this);
    this._modelEventTarget.register('option', (key, oldValue, newValue) => {
      this.update(newValue);
    });

    this._view.addEventListener('textChanged', (text) => {
      console.log(text);
      // this.configSource.importOption({text});
    });
  }

  accept(modelSource: Observable<any>): Subscription {
    return modelSource.subscribe((modelArray: Array<any>) => {
      const [config, data] = modelArray;
      this._modelEventTarget.trigger(config);
    });
  }

  update(option: any) {
    if (this._view) {
      this._view.update(option);
    }
  }

}
