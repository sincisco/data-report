import {CommentAuxiliary} from '../../graphic.view/auxiliary/comment.auxiliary';
import {RegionController} from '../../region/region.controller';
import {DefaultGraphic} from '../default.graphic';
import {Observable, Subscription} from 'rxjs';

const template = `
<div class="graphic m-graphic m-graphic-comment z-mode-edit">
<div class="frame" style="border: 0px solid rgb(204, 204, 204); background-color: rgba(1, 1, 1, 0); border-radius: 0px; opacity: 1;">
</div>
</div>
`;

export class CommentGraphic extends DefaultGraphic {
  $element: JQuery;
  private _$frame: JQuery;

  constructor(private _region: RegionController) {
    super();
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');
  }

  /**
   * 初始化graphic内容
   * @param option
   */
  init(option?: any) {
    this._view = new CommentAuxiliary(this);
    this._$frame.append(this._view.$element);
  }

  accept(modelSource: Observable<any>): Subscription {
    return modelSource.subscribe((modelArray: Array<any>) => {
      const [config, data] = modelArray;
      this._modelEventTarget.trigger(config);
    });
  }

  update(option: any) {
    if (this._view) {
      this._region.setDimensions(option.width, option.height);
      this._view.update(option);
    }
  }

}
