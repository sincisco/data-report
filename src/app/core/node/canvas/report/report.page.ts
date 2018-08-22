import {Dimensions, IPage} from '../../interface';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {ExplicitRegion} from '../../region/explicit.region';
import {Region} from '../../region/region';
import {CommentRegion} from '../../region/comment.region';
import {ComponentRef} from '@angular/core';
import {PageConfigComponent} from '../../../../layout/sider/page.config/page.config.component';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';
import {PageConfig} from '../../../../layout/sider/page.config/page.config';
import {graphicFactory} from '@core/node/factory/graphic.factory';
import {clipboard} from '@core/node/clipboard';
import {ChangeItem, ChangeManager} from '@core/node/utils/ChangeManager';

const ReportTemplate = `
    <div class="report-region">
        <div class="report-canvas">
          <div class="report-box">
             <div class="report-grid help-lines">
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
    this._children.forEach((value) => {
      value.unselect();
    });
  }

  unselect() {

  }

  addChild(child: Region) {
    child.page = this;
    this._children.push(child);
    this.$grid.append(child.$element);
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
          displayName: '新建图表',
          callback: () => {
            console.log('新建图表');
            // 如何建立关联
            const explicitRegion = new ExplicitRegion();
            explicitRegion.setCoordinates($event.offsetX, $event.offsetY);
            explicitRegion.refresh();
            this.addChild(explicitRegion);
            contextMenuHelper.close();
          }
        }, {
          displayName: '新建注释',
          callback: () => {
            console.log('新建注释');
            const commentRegion = new CommentRegion();
            commentRegion.setCoordinates($event.offsetX, $event.offsetY);
            commentRegion.refresh();
            this.addChild(commentRegion);
            contextMenuHelper.close();
          }
        }, {
          displayName: '新建文本',
          callback: () => {
            console.log('新建图表');
            // var graphNode = new RegionText();
            // graphNode.coordinates($event.offsetX, $event.offsetY);
            // graphNode.refresh();
            // this.addChild(graphNode);
            // contextMenuHelper.close();
          }
        }, {
          displayName: '剪切',
          shortcut: 'Ctrl+X'
        }, {
          displayName: '粘贴',
          shortcut: 'Ctrl+X',
          callback: () => {
            console.log('粘贴');
            graphicFactory.paste(clipboard.getData(), $event.offsetX, $event.offsetY);
            // graphicFactory.createFromOption(clipboard.getData(), $event.offsetX, $event.offsetY);
          }
        }, {
          displayName: '删除',
          shortcut: 'Backspace'
        }, 'split',
        {
          displayName: '创建'
        }
      ], $event.pageX, $event.pageY, $event);
      return false;
    });
  }
}
