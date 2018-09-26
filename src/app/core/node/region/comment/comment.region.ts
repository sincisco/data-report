import {RegionController, reportGlobal} from '../region.controller';
import {closestNum} from '../../../../utils/common';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {fromEvent, Subscription} from 'rxjs';
import {throttleTime} from 'rxjs/internal/operators';
import {TextAuxiliary} from '../../graphic.view/auxiliary/text.auxiliary';
import {CoordinatesAndDimensions, Dimensions} from '../../interface';
import {IGraphic} from '../../graphic/graphic';
import {TextGraphic} from '../../graphic/design/auxiliary.graphic/text.graphic';
import {CommentGraphic} from '../../graphic/design/auxiliary.graphic/comment.graphic';
import {CommentAuxiliary} from '../../graphic.view/auxiliary/comment.auxiliary';
import {ReportPage} from '../../page/report/page';
import {RegionModel, RegionState} from '../region.model';
import {RegionView} from '../region.view';
import {ExplicitRegionView} from '../explicit/explicit.region.view';
import {CommentRegionView} from './comment.region.view';
import {clipboard} from '@core/node/clipboard';


export class CommentRegion extends RegionController {

  constructor(protected _page: ReportPage) {
    super();
    this._model = new RegionModel();
    this._view = new CommentRegionView(this, this._model);

    this._page.addChild(this);

    this._init();
  }

  private _init() {
    this._view
      .addEventListener('select', () => {
        this._page.selectManager.select(this);
      })
      .addEventListener('ctrlSelect', () => {
        this._page.selectManager.ctrlSelect(this);
      })
      .addEventListener('resizeEnd', () => {
        if (this._graphic) {
          this._graphic.resize();
        }
      })
      .addEventListener('activateRegion', () => {
        this._page.activateRegion(this);
      });

    this._view.contextMenuGenerator = () => {
      return [{
        displayName: '复制',
        shortcut: 'Ctrl+C',
        callback: () => {
          console.log('复制');
          clipboard.saveData(this.derender());
          console.log(this.derender());
          return false;
        }
      }];
    };
  }

  /**
   * 用户单击mover的时候调用select，进入选中状态
   *
   * unselect 点击画布  所有的region、调用unselect方法
   *
   * 用户双击mover，进入激活状态   此时已经调用了select
   *
   * 点击mask  当前激活的region调用deactivate
   */
  set state(param: RegionState) {
    if (param === RegionState.selected && this._graphic) {
      reportGlobal.instance = this._graphic;
      this._graphic.activateConfig();
    } else if (param === RegionState.activated && this._graphic) {
      reportGlobal.instance = this._graphic;
      this._graphic.activate();
    } else if (this._model.state === RegionState.activated && param === RegionState.default && this._graphic) {
      (<any>this._graphic).deactivate();
    }
    this._model.state = param;
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

  derender() {
  }

  render() {
  }

}
