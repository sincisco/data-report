import {Dimensions, IPage} from '../../interface';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {Region} from '../../region/region';
import {ComponentRef} from '@angular/core';
import {PageConfigComponent} from '../../../../components/page.config/page.config.component';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';
import {PageModel} from '../../../../components/page.config/page.model';
import {graphicFactory} from '@core/node/factory/graphic.factory';
import {clipboard} from '@core/node/clipboard';
import {ChangeItem, ChangeManager} from '@core/node/manager/change.manager';
import {ISelectManager, SelectManager} from '@core/node/manager/select.manager';
import {regionSelectHelper} from '@core/node/helper/region.select.helper';
import {ReportPageView} from '@core/node/canvas/report/report.page.view';
import {RegionManager} from '@core/node/manager/region.manager';


export class ReportPage extends ReportPageView implements IPage {

  public selectManager: ISelectManager = new SelectManager();
  public regionManager = new RegionManager(this);

  private _configComponentRef: ComponentRef<PageModel>;

  constructor() {
    super();
    this._init();
  }

  private _init() {
    this
      .on('select', () => {
        this.select();
        this.activateConfig();
      })
      .on('regionSelect', (left, top, width, height) => {
        const array = this.regionManager.selectByBox(left, top, width, height);
        this.selectManager.clear();
        array.forEach((value) => {
          this.selectManager.ctrlSelect(value);
        });
      })
      .on('deactivateRegion', () => {
        this.regionManager.deactivate();
      });

    setTimeout(() => {
      if (!this._configComponentRef) {
        this._configComponentRef = siderLeftComponent.forwardCreateCanvasConfig(PageConfigComponent);
        this._configComponentRef.instance.page = this;
        this.refresh(this.model);
      }
    }, 10);

    this.appendContext([
      // {
      //   displayName: '新建 柱状图',
      //   callback: () => {
      //     // 如何建立关联
      //     graphicFactory.createByName('barChart', this, $event.offsetX, $event.offsetY);
      //     contextMenuHelper.close();
      //   }
      // }, {
      //   displayName: '新建注释',
      //   callback: () => {
      //     graphicFactory.createByName('commentAuxiliary', this, $event.offsetX, $event.offsetY);
      //     contextMenuHelper.close();
      //   }
      // }, {
      //   displayName: '新建文本',
      //   callback: () => {
      //     graphicFactory.createByName('textAuxiliary', this, $event.offsetX, $event.offsetY);
      //     contextMenuHelper.close();
      //   }
      // }, {
      //   displayName: '新建 Image',
      //   callback: () => {
      //     // 如何建立关联
      //     graphicFactory.createByName('imageAuxiliary', this, $event.offsetX, $event.offsetY);
      //     contextMenuHelper.close();
      //   }
      // }, 'split', {
      //   displayName: '剪切',
      //   shortcut: 'Ctrl+X'
      // }, {
      //   displayName: '粘贴',
      //   shortcut: 'Ctrl+X',
      //   enable: clipboard.hasData(),
      //   callback: () => {
      //     console.log('粘贴');
      //     if (clipboard.hasData()) {
      //       graphicFactory.paste(clipboard.getData(), $event.offsetX, $event.offsetY);
      //     }
      //     contextMenuHelper.close();
      //   }
      // }, {
      //   displayName: '删除',
      //   shortcut: 'Backspace'
      // }
    ]);

  }

  get model() {
    return this._configComponentRef ? this._configComponentRef.instance : null;
  }

  offset() {
    return this.$grid.offset();
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

