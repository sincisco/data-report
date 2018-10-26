import {RegionController} from '../region.controller';
import {RegionModel, RegionState} from '../region.model';
import {CommentRegionView} from './comment.region.view';
import {clipboard} from '@core/node/clipboard';
import {IReportPage} from '@core/node/page/report/page.interface';


export class CommentRegion extends RegionController {

  constructor(protected _page: IReportPage) {
    super();
    this._model = new RegionModel();
    this._view = new CommentRegionView(this, this._model);

    this._page.addChild(this);

    this._init();
  }

  private _init() {
    this._view
      .addEventListener('select', () => {
        this._page.select(this);
      })
      .addEventListener('ctrlSelect', () => {
        this._page.ctrlSelect(this);
      })
      .addEventListener('resizeEnd', () => {
        if (this._graphicWrapper) {
          this._graphicWrapper.resize();
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
          clipboard.saveData(this.getOption());
          console.log(this.getOption());
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
    if (param === RegionState.selected && this._graphicWrapper) {
      this._graphicWrapper.activateConfig();
    } else if (param === RegionState.activated && this._graphicWrapper) {
      this._graphicWrapper.activate();
    } else if (this._model.state === RegionState.activated && param === RegionState.default && this._graphicWrapper) {
      (<any>this._graphicWrapper).deactivate();
    }
    this._model.state = param;
  }

  /**
   * 点击mask  当前激活的region调用deactivate
   */
  deactivate() {
    this._model.state = RegionState.default;
    // this._view.unselect();
    if (this._graphicWrapper) {
      (<any>this._graphicWrapper).deactivate();
    }
    // this.refresh();
  }

  getOption() {
  }

  render() {
  }

}
