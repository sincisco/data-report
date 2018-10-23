import {IPage} from '../../interface';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {RegionController} from '../../region/region.controller';
import {ComponentRef} from '@angular/core';
import {PageConfigComponent} from '../../../../components/page.config/page.config.component';
import {PageConfig} from '../../../../components/page.config/page.config';
import {graphicFactory} from '@core/node/factory/graphic.factory';
import {clipboard} from '@core/node/clipboard';
import {ISelectManager, SelectManager} from '@core/node/manager/select.manager';
import {regionSelectHelper} from '@core/node/helper/region.select.helper';
import {PageView} from '@core/node/page/report/page.view';
import {RegionManager} from '@core/node/manager/region.manager';
import {ActivateManager} from '@core/node/manager/activate.manager';
import {session} from '@core/node/utils/session';
import {DataSourceManager} from '@core/data/data.source.manager';
import {ConfigSourceManager} from '@core/config/config.source.manager';
import {DataOptionManager} from '@core/data/data.option.manager';
import {ActionManager} from '@core/node/operate/action.manager';

export class ReportPage extends PageView implements IPage {

  public regionManager: RegionManager;
  public selectManager: ISelectManager;
  public activateManager: ActivateManager;
  public configSourceManager: ConfigSourceManager;
  public dataSourceManager: DataSourceManager;
  public actionManager: ActionManager;

  static builder(): ReportPage {
    const componentRef = session.siderLeftComponent.forwardCreateCanvasConfig(PageConfigComponent);

    return new ReportPage(componentRef);
  }

  constructor(private _configComponentRef: ComponentRef<PageConfig>) {
    super();
    this.regionManager = new RegionManager();
    this.selectManager = new SelectManager();
    this.activateManager = new ActivateManager(this);
    this.configSourceManager = new ConfigSourceManager('design');
    this.dataSourceManager = new DataSourceManager(DataOptionManager.getInstance().getDataOptionSet('space1'));
    this.actionManager = new ActionManager();
    this.accept(this.model);
    this._init();
  }

  load(option: any) {
    this.model.importOption(option.option);
    option.children.forEach((value) => {
      graphicFactory.paste(value);
    });
  }

  save() {
    return {
      option: this.model.exportOption(),
      children: this.regionManager.saveAs()
    };
  }

  enterFullScreen() {
    this._$box[0].requestFullscreen();
  }


  accept(model: PageConfig) {
    super.accept(model);
    model.register('themeMode', (key, oldValue, newValue) => {
      this.regionManager.regionArray.forEach((item) => {
        item.updateTheme(newValue);
      });
    });
  }


  private _init() {
    this
      .addEventListener('select', () => {
        this.selectManager.clear();
        session.siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
      })
      .addEventListener('regionSelect', (left, top, width, height) => {
        const array = this.regionManager.selectByBox(left, top, width, height);
        this.selectManager.clear();
        console.log(array.length);
        array.forEach((value) => {
          this.selectManager.ctrlSelect(value);
        });
      })
      .addEventListener('deactivateRegion', () => {
        this.activateManager.deactivate();
      });

    this.contextMenuGenerator = () => {
      return [
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
            console.log('粘贴', clipboard.getData());
            graphicFactory.paste(clipboard.getData(), $event.offsetX, $event.offsetY);
            return false;
          }
        }, {
          displayName: '删除',
          shortcut: 'Backspace'
        }
      ];
    };

  }

  get model() {
    return this._configComponentRef ? this._configComponentRef.instance : null;
  }

  addChild(child: RegionController) {
    // child.page = this;
    this.regionManager.add(child);
    this.$grid.append(child.$element);
  }

  removeChild(child: RegionController) {
    this.selectManager.delete(child);
    this.regionManager.remove(child);
  }

  activateRegion(region) {
    this.activateManager.activate(region);
  }

  regionResize(region: RegionController) {
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

