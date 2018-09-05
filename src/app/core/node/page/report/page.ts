import {IPage} from '../../interface';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {Region} from '../../region/region';
import {ComponentRef} from '@angular/core';
import {PageConfigComponent} from '../../../../components/page.config/page.config.component';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';
import {PageModel} from '../../../../components/page.config/page.model';
import {graphicFactory} from '@core/node/factory/graphic.factory';
import {clipboard} from '@core/node/clipboard';
import {ISelectManager, SelectManager} from '@core/node/manager/select.manager';
import {regionSelectHelper} from '@core/node/helper/region.select.helper';
import {PageView} from '@core/node/page/report/page.view';
import {RegionManager} from '@core/node/manager/region.manager';
import {ActivateManager} from '@core/node/manager/activate.manager';

export class ReportPage extends PageView implements IPage {

  public regionManager: RegionManager;
  public selectManager: ISelectManager;
  public activateManager: ActivateManager;

  static builder(): ReportPage {
    const componentRef = siderLeftComponent.forwardCreateCanvasConfig(PageConfigComponent);

    return new ReportPage(componentRef);
  }

  constructor(private _configComponentRef: ComponentRef<PageModel>) {
    super();
    this.regionManager = new RegionManager();
    this.selectManager = new SelectManager();
    this.activateManager = new ActivateManager(this);
    this.listenToModel(this.model);
    this.regionManager.listenToModel(this.model);
    this._init();
  }

  load(array: Array<any>) {
    array.forEach((value) => {
      graphicFactory.paste(value);
    });
  }

  save() {
    return this.regionManager.save();
  }


  private _init() {
    this
      .addEventListener('select', () => {
        this.selectManager.clear();
        siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
      })
      .addEventListener('regionSelect', (left, top, width, height) => {
        const array = this.regionManager.selectByBox(left, top, width, height);
        this.selectManager.clear();
        array.forEach((value) => {
          this.selectManager.ctrlSelect(value);
        });
      })
      .addEventListener('deactivateRegion', () => {
        this.activateManager.deactivate();
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
        // enable: clipboard.hasData(),
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

  addChild(child: Region) {
    // child.page = this;
    this.regionManager.add(child);
    this.$grid.append(child.$element);
  }

  removeChild(child: Region) {
    this.selectManager.delete(child);
    this.regionManager.remove(child);
  }

  activateRegion(region) {
    this.activateManager.activate(region);
  }

  regionResize(region: Region) {
    this.activateManager.regionResize(region);
  }

  activate() {

  }

  deactivate() {
  }

  unselect() {

  }

  destroy() {

  }
}

