import {Dimensions, INode} from '../../interface';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {ExplicitRegion} from '../../region/explicit.region';
import {Region} from '../../region/region';
import {CommentRegion} from '../../region/comment.region';
import {ComponentRef} from '@angular/core';
import {PageConfigComponent} from '../../../../layout/sider/page.config/page.config.component';
import {siderLeftComponent} from '../../../../layout/sider/sider.left.component';
import {PageConfig} from '../../../../layout/sider/page.config/page.config';
import {graphicFactory} from '@core/node/factory/chart.factory';

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

export class ReportCanvas implements INode {
  private _dimensions: Dimensions = {
    width: 960,
    height: 720
  };
  private _scale = 1;
  private _regionActivated = false;
  private _children: Array<Region> = [];


  $element: JQuery;
  $region: JQuery;
  $canvas: JQuery;
  $box: JQuery;
  $grid: JQuery;

  $mask: JQuery;

  private _activatedRegion: Region;

  private _configComponentRef: ComponentRef<PageConfig>;

  constructor() {
    this.$element = this.$region = $(ReportTemplate);
    this.$canvas = this.$element.find('.report-canvas');
    this.$box = this.$element.find('.report-box');
    this.$grid = this.$element.find('.report-grid');
    this.$mask = this.$element.find('.u-edit-mask');
    this.refresh();

    this.$grid.contextmenu(($event: JQuery.Event) => {
      contextMenuHelper.open([
        {
          displayName: '新建图表',
          callback: () => {
            console.log('新建图表');
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
          displayName: '删除',
          shortcut: 'Backspace'
        }, 'split',
        {
          displayName: '创建'
        }
      ], $event.pageX, $event.pageY, $event);
      return false;
    });

    this._init();
  }


  activateRegion(region: Region) {
    region.activate();
    this._activatedRegion = region;
    const $element: JQuery = region.$element,
      $mask = this.$mask,
      left = $element.position().left,
      top = $element.position().top,
      width = $element.outerWidth(),
      height = $element.outerHeight();
    $mask.find('.mask-left').width(Math.max(0, left));
    $mask.find('.mask-right').css({
      left: left + width
    });
    $mask.find('.mask-bottom').width(width).css({
      left: Math.max(0, left),
      top: top + height
    });
    $mask.find('.mask-top').width(width).height(Math.max(top, 0)).css({
      left: Math.max(0, left)
    });

    this.regionActivated = true;
  }

  regionResize(region: Region) {
    const $element: JQuery = region.$element,
      $mask = this.$mask,
      left = $element.position().left,
      top = $element.position().top,
      width = $element.outerWidth(),
      height = $element.outerHeight();
    $mask.find('.mask-left')
      .width(Math.max(0, left));
    $mask.find('.mask-right')
      .css({
        left: left + width
      });
    $mask.find('.mask-bottom')
      .width(width)
      .css({
        left: Math.max(0, left),
        top: top + height
      });
    $mask.find('.mask-top')
      .width(width)
      .height(Math.max(top, 0))
      .css({
        left: Math.max(0, left)
      });
  }

  activate() {
    siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
  }

  get regionActivated() {
    return this._regionActivated;
  }

  set regionActivated(param: boolean) {
    if (this._regionActivated === param) {
      return;
    }
    this._regionActivated = param;
    if (param) {
      this.$element.addClass('activated');
    } else {
      this.$element.removeClass('activated');
    }
  }

  public update(option) {
    if (option.backgroundMode === 'built-in') {
      this.$box.css({
        backgroundImage: `none`
      });
      this.$box.removeClass('background1 background2 background3 background4');
      this.$box.addClass(option.backgroundClass);
    } else if (option.backgroundMode === 'custom') {
      this.$box.removeClass('background1 background2 background3 background4');
      option.backgroundDataUrl && this.$box.css({
        backgroundImage: `url(${option.backgroundDataUrl})`
      });
    } else if (option.backgroundMode === 'only-color') {
      this.$box.removeClass('background1 background2 background3 background4');
      this.$box.css({
        backgroundImage: `none`
      });
      option.backgroundColor && this.$box.css({
        backgroundColor: option.backgroundColor
      });
    }

    this.width = option.width;
    this.height = option.height;
    this.refresh();
    console.log('help-lines', option.auxiliaryLine);
    this.$grid.toggleClass('help-lines', option.auxiliaryLine);

    this._children.forEach((item) => {
      item.updateTheme(option.themeMode);
    });
  }

  private _init() {
    this.$grid.click(($event) => {
      console.log('click');
      if ($event.target === this.$grid[0]) {
        this.select();
        this.activate();
      }
    });

    this.$grid.on('dragover', ($event: JQuery.Event) => {
      const dragEvent = <DragEvent>$event.originalEvent;

      dragEvent.dataTransfer.dropEffect = 'copyMove';
      $event.preventDefault();
    });
    this.$mask.click(() => {
      console.log('this.$mask.click');
      this.regionActivated = false;
      console.log(!!this._activatedRegion);
      this._activatedRegion && (<any>this._activatedRegion).deactivate();
    });

    setTimeout(() => {
      if (!this._configComponentRef) {
        this._configComponentRef = siderLeftComponent.forwardCreateCanvasConfig(PageConfigComponent);
        this._configComponentRef.instance.page = this;
      }
    }, 100);
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

  addChild(child: Region) {
    child.report = this;
    this._children.push(child);
    this.$grid.append(child.$element);
  }

  select() {
    this._children.forEach((value) => {
      value.unselect();
    });
  }

  unselect() {

  }

  destroy() {

  }
}
