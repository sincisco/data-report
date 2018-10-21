import {CommentAuxiliary} from '../../graphic.view/auxiliary/comment.auxiliary';
import {CommentConfigComponent} from '../../../../components/graphic.config/auxiliary/comment.config.component';
import {IGraphicView} from '../../graphic.view/graphic.view';
import {RegionController} from '../../region/region.controller';
import {DefaultGraphic} from '../default.graphic';
import {session} from '../../utils/session';

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
    super('comment.graphic');
    this.$element = $(template);
    this._$frame = this.$element.find('.frame');

    _region.addChild(this);
  }

  get configSource() {
    return this._configComponentRef.instance;
  }

  addChild(view: IGraphicView) {
    this._view = view;
    this._$frame.append(view.$element);
  }

  /**
   * 初始化graphic内容
   * @param option
   */
  init(option?: any) {
    this._view = new CommentAuxiliary(this);
    this._configComponentRef = session.siderLeftComponent.forwardCreateGraphicConfig(CommentConfigComponent);
    if (option) {
      this.configSource.importOption(option);
    }
  }

  update(option: any) {
    if (this._view) {
      this._region.setDimensions(option.width, option.height);
      this._view.update(option);
    }
  }

}
