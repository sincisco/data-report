import {IPage} from '../../interface';
import {ComponentRef} from '@angular/core';
import {PageConfig} from '../../../../components/page.config/page.config';
import {graphicFactory} from '@core/node/factory/graphic.factory';
import {clipboard} from '@core/node/clipboard';
import {ISelectManager, SelectManager} from '@core/node/manager/select.manager';
import {PageView} from '@core/node/page/report/page.view';
import {RegionManager} from '@core/node/manager/region.manager';
import {ActivateManager} from '@core/node/manager/activate.manager';
import {session} from '@core/node/utils/session';
import {DataSourceManager} from '@core/data/data.source.manager';
import {ConfigSourceManager} from '@core/config/config.source.manager';
import {DataOptionManager} from '@core/data/data.option.manager';
import {ActionManager} from '@core/node/operate/action.manager';
import {PageConfigWrapper} from '@core/node/page/report/page.outer';

export class ReportPageInner implements IPage {

  public view: PageView;
  public regionManager: RegionManager;
  public selectManager: ISelectManager;
  public activateManager: ActivateManager;

  public configSourceManager: ConfigSourceManager;
  public dataSourceManager: DataSourceManager;
  public actionManager: ActionManager;

  constructor(private _pageConfigWrapper: PageConfigWrapper) {
    this.view = new PageView(this);
    this.regionManager = new RegionManager();
    this.selectManager = new SelectManager();
    this.activateManager = new ActivateManager(this);
    this.configSourceManager = new ConfigSourceManager('design');
    this.dataSourceManager = new DataSourceManager(DataOptionManager.getInstance().getDataOptionSet('space1'));
    this.actionManager = new ActionManager();
  }

  get model() {
    return this._pageConfigWrapper.model;
  }

  init() {
    this.accept(this.model);
    this.view.accept(this.model);
    this._init();
  }

  /**
   * 监听model事件
   * @param {PageConfig} model
   */
  accept(model: PageConfig) {
    model.register('themeMode', (key, oldValue, newValue) => {
      this.regionManager.regionArray.forEach((item) => {
        item.updateTheme(newValue);
      });
    });
  }


  /**
   * 监听PageView事件
   * 设置View的上下文事件处理函数生成器
   * @private
   */
  private _init() {
    this.view
      .addEventListener('select', () => {
        this.selectManager.clear();
        this._pageConfigWrapper.show();
      })
      .addEventListener('boxSelect', (left, top, width, height) => {
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

    this.view.contextMenuGenerator = () => {
      return [
        /*     {
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
             },*/ 'split', {
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

  activate() {

  }

  deactivate() {
  }

  unselect() {

  }

  destroy() {

  }
}

