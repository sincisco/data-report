import {Region, reportGlobal} from '../region';
import {closestNum} from '../../../../utils/common';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {fromEvent, Subscription} from 'rxjs';
import {throttleTime} from 'rxjs/internal/operators';
import {TextAuxiliary} from '../../graphic.view/auxiliary/text.auxiliary';
import {CoordinatesAndDimensions, Dimensions} from '../../interface';
import {IGraphic} from '../../graphic/graphic';
import {TextGraphic} from '../../graphic/auxiliary.graphic/text.graphic';
import {CommentGraphic} from '../../graphic/auxiliary.graphic/comment.graphic';
import {CommentAuxiliary} from '../../graphic.view/auxiliary/comment.auxiliary';
import {ReportPage} from '../../page/report/page';
import {RegionModel, RegionState} from '../region.model';
import {RegionView} from '../region.view';
import {ExplicitRegionView} from '../explicit/explicit.region.view';
import {CommentRegionView} from './comment.region.view';


export class CommentRegion extends Region {

  private readonly _model: RegionModel;
  private readonly _view: RegionView;

  // 模型层
  protected _page: ReportPage;
  protected _graphic: IGraphic;

  constructor() {
    super();
    this._model = new RegionModel();
    this._view = new CommentRegionView(this, this._model);
    // this.refresh();
    // setTimeout(() => {
    //   this._bindEvent();
    // }, 10);
  }

  get $element() {
    return this._view.$element;
  }

  init() {
    this._view.addEventListener('resizeEnd', () => {
      if (this._graphic) {
        this._graphic.resize();
      }
    });
  }


  set page(param: ReportPage) {
    this._page = param;
  }

  get page() {
    return this._page;
  }

  /**
   * 用户单击mover的时候调用select，进入选中状态
   */
  select() {
    this._model.state = RegionState.selected;
    if (this._graphic) {
      reportGlobal.instance = this._graphic;
      this._graphic.activateConfig();
    }
    // this.refresh();
  }

  multiSelect() {
    this._model.state = RegionState.multiSelected;
  }

  /**
   * 点击画布  所有的region、调用unselect方法
   */
  unselect() {
    this._model.state = RegionState.default;
  }

  multiUnselect() {
    this._model.state = RegionState.default;
  }

  /**
   * 用户双击mover，进入激活状态   此时已经调用了select
   */
  activate() {
    this._model.state = RegionState.activated;
    if (this._graphic) {
      reportGlobal.instance = this._graphic;
      this._graphic.activate();
    }
  }

  /**
   * 点击mask  当前激活的region调用deactivate
   */
  deactivate() {
    this._model.state = RegionState.default;
    // this._view.unselect();
    if (this._graphic) {
      (<any>this._graphic).deactivate();
    }
    // this.refresh();
  }

  updateTheme(theme: string) {
    if (this._graphic) {
      this._graphic.updateTheme(theme);
    }
  }

  /**
   * 1、销毁内部对象
   * 2、解除事件绑定
   * 3、解除当前对象的属性引用
   */
  destroy() {
    if (this._graphic) {
      this._graphic.destroy();
      this._graphic = null;
    }
    this._page.removeChild(this);
    this._page = null;
    this._view.destroy();
  }


  setDimensions(width: number, height: number) {
    // this.width = width;
    // this.height = height;
    // this.refresh();
  }

  addChild(graphic: IGraphic) {
    this._graphic = graphic;
    this._view.$fill.append(graphic.$element);
  }

  derender() {
  }
}
