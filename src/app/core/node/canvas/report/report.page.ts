import {Dimensions, IPage} from '../../interface';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {Region} from '../../region/region';
import {ComponentRef} from '@angular/core';
import {PageConfigComponent} from '../../../../components/page.config/page.config.component';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';
import {PageModel} from '../../../../components/page.config/page.model';
import {graphicFactory} from '@core/node/factory/graphic.factory';
import {clipboard} from '@core/node/clipboard';
import {ChangeItem, ModelEventTarget} from '@core/node/manager/change.manager';
import {ISelectManager, SelectManager} from '@core/node/manager/select.manager';
import {regionSelectHelper} from '@core/node/helper/region.select.helper';
import {ReportPageView} from '@core/node/canvas/report/report.page.view';
import {RegionManager} from '@core/node/manager/region.manager';


export class ReportPage extends ReportPageView implements IPage {

  public selectManager: ISelectManager;
  public regionManager;

  static builder(): ReportPage {
    const componentRef = siderLeftComponent.forwardCreateCanvasConfig(PageConfigComponent);

    return new ReportPage(componentRef);
  }

  constructor(private _configComponentRef: ComponentRef<PageModel>) {
    super();
    this.selectManager = new SelectManager();
    this.regionManager = new RegionManager(this);
    this.listenToModel(this.model);
    this._init();

    this.refresh(this.model);
  }

  private _init() {
    this
      .addEventListener('select', () => {
        this.select();
        this.activateConfig();
      })
      .addEventListener('regionSelect', (left, top, width, height) => {
        const array = this.regionManager.selectByBox(left, top, width, height);
        this.selectManager.clear();
        array.forEach((value) => {
          this.selectManager.ctrlSelect(value);
        });
      })
      .addEventListener('deactivateRegion', () => {
        this.regionManager.deactivate();
      });

    this.appendContext([
      {
        displayName: '新建 柱状图',
        callback: ($event) => {
          // 如何建立关联
          graphicFactory.createByName('barChart', this, $event.offsetX, $event.offsetY);
          contextMenuHelper.close();
        }
      }, {
        displayName: '新建注释',
        callback: ($event) => {
          graphicFactory.createByName('commentAuxiliary', this, $event.offsetX, $event.offsetY);
          contextMenuHelper.close();
        }
      }, {
        displayName: '新建文本',
        callback: ($event) => {
          graphicFactory.createByName('textAuxiliary', this, $event.offsetX, $event.offsetY);
          contextMenuHelper.close();
        }
      }, {
        displayName: '新建 Image',
        callback: ($event) => {
          // 如何建立关联
          graphicFactory.createByName('imageAuxiliary', this, $event.offsetX, $event.offsetY);
          contextMenuHelper.close();
        }
      }, 'split', {
        displayName: '剪切',
        shortcut: 'Ctrl+X'
      }, {
        displayName: '粘贴',
        shortcut: 'Ctrl+X',
        enable: clipboard.hasData(),
        callback: ($event) => {
          console.log('粘贴');
          if (clipboard.hasData()) {
            graphicFactory.paste(clipboard.getData(), $event.offsetX, $event.offsetY);
          }
          contextMenuHelper.close();
        }
      }, {
        displayName: '删除',
        shortcut: 'Backspace'
      }
    ]);

  }

  get model() {
    return this._configComponentRef ? this._configComponentRef.instance : null;
  }

  offset() {
    return this.$grid.offset();
  }

  set scale(param) {

  }

  get scale() {
    return 1;
  }

  addChild(child: Region) {
    child.page = this;
    this.$grid.append(child.$element);
  }

  deleteChild(child: Region) {
    this.selectManager.delete(child);
    this.regionManager.deleteRegion(child);
  }

  activateRegion(region) {
    this.regionManager.activate(region);
  }

  regionResize(region: Region) {
    this.regionManager.regionResize(region);
  }

  maskRepaint($activateElement: JQuery) {
    this.maskRepaint($activateElement);
  }

  activate() {

  }

  deactivate() {
  }

  select() {
    this.selectManager.clear();
  }

  unselect() {

  }

  activateConfig() {
    siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
  }

  destroy() {

  }
}

