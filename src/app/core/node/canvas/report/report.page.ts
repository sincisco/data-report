import {Dimensions, IPage} from '../../interface';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {Region} from '../../region/region';
import {ComponentRef} from '@angular/core';
import {PageConfigComponent} from '../../../../components/page.config/page.config.component';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';
import {PageConfig} from '../../../../components/page.config/page.config';
import {graphicFactory} from '@core/node/factory/graphic.factory';
import {clipboard} from '@core/node/clipboard';
import {ChangeItem, ChangeManager} from '@core/node/utils/change.manager';
import {ISelectManager, SelectManager} from '@core/node/utils/select.manager';
import {regionSelectHelper} from '@core/node/helper/region.select.helper';

const ReportTemplate = `
    <div class="report-region">
        <div class="report-canvas">
          <div class="report-box">
             <div class="report-grid" draggable="true">
             <div class="u-edit-mask">
                <div class="mask mask-left" tabindex="-1"></div>
                <div class="mask mask-right" tabindex="-1"></div>
                <div class="mask mask-bottom" tabindex="-1"></div>
                <div class="mask mask-top" tabindex="-1"></div>
              </div>
             </div>
          </div>
        </div>
    </div>
    `;

export class ReportPage extends ChangeManager implements IPage {
  private _dimensions: Dimensions = {
    width: 960,
    height: 720
  };
  private _scale = 1;
  private _children: Array<Region> = [];

  private _activatedRegion: Region;

  public selectManager: ISelectManager = new SelectManager();

  $element: JQuery;
  $region: JQuery;
  $canvas: JQuery;
  $box: JQuery;
  $grid: JQuery;

  $mask: JQuery;
  $maskLeft: JQuery;
  $maskRight: JQuery;
  $maskTop: JQuery;
  $maskBottom: JQuery;

  private _configComponentRef: ComponentRef<PageConfig>;

  constructor() {
    super();
    this.$element = this.$region = $(ReportTemplate);
    this.$canvas = this.$element.find('.report-canvas');
    this.$box = this.$element.find('.report-box');
    this.$grid = this.$element.find('.report-grid');


    const $mask = this.$mask = this.$element.find('.u-edit-mask');
    this.$maskLeft = $mask.find('.mask-left');
    this.$maskRight = $mask.find('.mask-right');
    this.$maskTop = $mask.find('.mask-top');
    this.$maskBottom = $mask.find('.mask-bottom');
    this.refresh();

    this._init();
    this._initForUpdate();
    this._bindContextEvent();
  }

  private _init() {
    this.$grid.click(($event) => {
      console.log('click');
      if ($event.target === this.$grid[0]) {
        this.select();
        this.activateConfig();
      }
    }).on('dragstart', ($event: JQuery.Event) => {
      const startPageX = $event.pageX, startPageY = $event.pageY;
      let left: number, top: number, width: number, height: number;
      const mousemove = (event: MouseEvent) => {
        left = Math.min(startPageX, event.pageX);
        top = Math.min(startPageY, event.pageY);
        width = Math.abs(event.pageX - startPageX);
        height = Math.abs(event.pageY - startPageY);
        regionSelectHelper.show(left, top, width, height);
      }, mouseup = (event: MouseEvent) => {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
        regionSelectHelper.hide();
        this._regionSelect(left, top, width, height);
      };
      regionSelectHelper.start($event.pageX, $event.pageY);

      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup);
      return false;
    });


    this.$grid.on('dragover', ($event: JQuery.Event) => {
      const dragEvent = <DragEvent>$event.originalEvent;

      dragEvent.dataTransfer.dropEffect = 'copyMove';
      $event.preventDefault();
    });
    this.$mask.click(() => {
      console.log('$mask  click');
      this.deactivateRegion();
    });

    setTimeout(() => {
      if (!this._configComponentRef) {
        this._configComponentRef = siderLeftComponent.forwardCreateCanvasConfig(PageConfigComponent);
        this._configComponentRef.instance.page = this;
      }
    }, 100);
  }

  private _regionSelect(left, top, width, height) {
    const array = this._children.filter((value: Region) => {
      const $element = value.$element, offset = $element.offset(), width1 = $element.outerWidth(), height1 = $element.outerHeight();
      return this._judge(left, top, left + width, top + height, offset.left, offset.top, offset.left + width1, offset.top + height1);
    });
    this.selectManager.clear();
    array.forEach((value) => {
      this.selectManager.ctrlSelect(value);
    });
  }

  private _judge(x1, y1, x2, y2, x3, y3, x4, y4) {
    if (x3 > x1 && y3 > y1 && x2 > x4 && y2 > y4) {
      return true;
    }
    return false;
  }

  private _initForUpdate() {
    this.register('backgroundMode', (key, oldValue, newValue, option) => {
    });

    this.register('remove.backgroundClass', (key, oldValue, newValue) => {
      this.$box.removeClass('background1 background2 background3 background4');
    });
    this.register('add.backgroundClass backgroundClass', (key, oldValue, newValue) => {
      this.$box.removeClass(oldValue).addClass(newValue);
    });
    this.register('remove.backgroundCustom', (key, oldValue, newValue) => {
      this.$box.css({
        backgroundImage: `none`
      });
    });
    this.register('add.backgroundCustom backgroundCustom', (key, oldValue, newValue) => {
      newValue.backgroundDataUrl && this.$box.css({
        backgroundImage: `url(${newValue.backgroundDataUrl})`
      });
    });
    this.register('remove.backgroundColor', (key, oldValue, newValue) => {
      this.$box.css({
        backgroundColor: 'transparent'
      });
    });
    this.register('add.backgroundColor backgroundColor', (key, oldValue, newValue) => {
      this.$box.css({
        backgroundColor: newValue
      });
    });

    this.register('width', (key, oldValue, newValue) => {
      this.width = newValue;
      this.refresh();
    });
    this.register('height', (key, oldValue, newValue) => {
      this.height = newValue;
      this.refresh();
    });
    this.register('auxiliaryLine', (key, oldValue, newValue) => {
      this.$grid.toggleClass('help-lines', newValue);
    });
    this.register('themeMode', (key, oldValue, newValue) => {
      this._children.forEach((item) => {
        item.updateTheme(newValue);
      });
    });
  }

  activateRegion(region: Region) {
    this._activatedRegion = region;
    region.activate();
    this.$element.addClass('activated');
    this._maskRepaint(region.$element);
  }

  deactivateRegion() {
    if (this._activatedRegion) {
      this._activatedRegion.deactivate();
      this._activatedRegion = null;
      this.$element.removeClass('activated');
    }
  }

  regionResize(region: Region) {
    this._maskRepaint(region.$element);
  }

  private _maskRepaint($activateElement: JQuery) {
    const left = $activateElement.position().left,
      top = $activateElement.position().top,
      width = $activateElement.outerWidth(),
      height = $activateElement.outerHeight();
    this.$maskLeft
      .width(Math.max(0, left));
    this.$maskRight
      .css({
        left: left + width
      });
    this.$maskBottom
      .width(width)
      .css({
        left: Math.max(0, left),
        top: top + height
      });
    this.$maskTop
      .width(width)
      .height(Math.max(top, 0))
      .css({
        left: Math.max(0, left)
      });
  }

  get regionActivated() {
    return !!this._activatedRegion;
  }

  activate() {

  }

  activateConfig() {
    siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
  }

  public update(changeItemArray: Array<ChangeItem>) {
    changeItemArray.forEach((value, index, array) => {
      this.trigger(value);
    });
  }

  select() {
    this.selectManager.clear();
  }

  unselect() {

  }

  addChild(child: Region) {
    child.page = this;
    this._children.push(child);
    this.$grid.append(child.$element);
  }

  deleteChild(child: Region) {
    if (this._children.includes(child)) {
      this.selectManager.delete(child);
      this._children.splice(this._children.indexOf(child), 1);
    }
  }

  set width(width: number) {
    this._dimensions.width = width;
  }

  set height(height: number) {
    this._dimensions.height = height;
  }

  get scale() {
    return this._scale;
  }

  set scale(param: number) {
    this._scale = param / 100;
    this.refresh();
  }

  refresh() {
    const width = this._dimensions.width, height = this._dimensions.height;

    this._setDim(this.$region, width * this.scale + 50, height * this.scale + 30);
    this._setDim(this.$canvas, width * this.scale, height * this.scale);
    this.$box.css('transform', `translate(-50%, -50%) scale(${this.scale})`);
    this._setDim(this.$grid, width, height);
  }

  private _setDim($ele, width, height) {
    $ele.css('width', width).css('height', height);
  }

  destroy() {

  }

  private _bindContextEvent() {
    this.$grid.contextmenu(($event: JQuery.Event) => {
      contextMenuHelper.open([
        {
          displayName: '新建 柱状图',
          callback: () => {
            // 如何建立关联
            graphicFactory.createByName('barChart', this, $event.offsetX, $event.offsetY);
            contextMenuHelper.close();
          }
        }, {
          displayName: '新建注释',
          callback: () => {
            graphicFactory.createByName('commentAuxiliary', this, $event.offsetX, $event.offsetY);
            contextMenuHelper.close();
          }
        }, {
          displayName: '新建文本',
          callback: () => {
            graphicFactory.createByName('textAuxiliary', this, $event.offsetX, $event.offsetY);
            contextMenuHelper.close();
          }
        }, {
          displayName: '新建 Image',
          callback: () => {
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
          callback: () => {
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
      ], $event.pageX, $event.pageY, $event);
      return false;
    });
  }
}

