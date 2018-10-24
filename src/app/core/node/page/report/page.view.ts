import {boxSelectHelper} from '@core/node/helper/box.select.helper';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {PageConfig} from '../../../../components/page.config/page.config';
import {View} from '@core/node/structure/view';
import {session} from '@core/node/utils/session';
import {repaintMaskGenerator} from '@core/node/helper/mask.helper';
import {ReportPageInner} from '@core/node/page/report/page.inner';

const TEMPLATE = `
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

export class PageView extends View {
  $element: JQuery;
  protected readonly _$canvas: JQuery;
  protected readonly _$box: JQuery;
  $grid: JQuery;

  repaintMask: Function;

  private _scale = 1;
  private _width: number;
  private _height: number;
  private _contextMenuGenerator: Function;

  constructor(private _page: ReportPageInner) {
    super();
    const $element = this.$element = $(TEMPLATE);

    this._$canvas = $element.find('.report-canvas');
    this._$box = $element.find('.report-box');
    this.$grid = $element.find('.report-grid');

    this.repaintMask = repaintMaskGenerator($element.find('.u-edit-mask'));

    this._bind();
  }

  enterFullScreen() {
    this._$box[0].requestFullscreen();
  }

  set contextMenuGenerator(generator: Function) {
    this._contextMenuGenerator = generator;
  }

  get scale() {
    return this._scale;
  }

  set scale(param: number) {
    this._scale = param / 100;
    this._refresh();
  }

  /**
   * 获取画布相对于文档的偏移值
   * @returns {JQuery.Coordinates | undefined}
   */
  offset() {
    return this.$grid.offset();
  }

  private _refresh() {
    if (this._width && this._height) {
      this.$element.css({
        'width': this._width * this.scale + 50,
        'height': this._height * this.scale + 30
      });
      this._$canvas.css({
        width: this._width * this.scale,
        height: this._height * this.scale
      });
      this._$box.css('transform', `translate(-50%, -50%) scale(${this.scale})`);
      this.$grid.css({
        width: this._width,
        height: this._height
      });
    }
  }

  // 试图到模型
  private _bind() {
    this._bindEvent();
    this._bindContextEvent();
  }

  private _bindEvent() {
    const eventTarget = this._eventTarget;
    this.$element.find('.u-edit-mask').on('click', () => {
      eventTarget.dispatchEvent('deactivateRegion');
    });

    this.$grid
      .on('click', ($event) => {
        if ($event.target === this.$grid[0]) {
          eventTarget.dispatchEvent('select');
        }
      })
      .on('dragstart', ($event: JQuery.Event) => {
        if (this._page.activateManager.regionActivated) {
          return false;
        }
        const startPageX = $event.pageX, startPageY = $event.pageY;
        let left: number, top: number, width: number, height: number;
        const
          mousemove = (event: MouseEvent) => {
            boxSelectHelper.show(
              left = Math.min(startPageX, event.pageX),
              top = Math.min(startPageY, event.pageY),
              width = Math.abs(event.pageX - startPageX),
              height = Math.abs(event.pageY - startPageY));
          },
          mouseup = (event: MouseEvent) => {
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
            boxSelectHelper.hide();
            this._eventTarget.dispatchEvent('boxSelect', left, top, width, height);
          };
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);

        boxSelectHelper.start($event.pageX, $event.pageY);
        return false;
      })
      .on('dragover', ($event: JQuery.Event) => {
        (<DragEvent>$event.originalEvent).dataTransfer.dropEffect = 'copyMove';
        $event.preventDefault();
      });
  }

  private _bindContextEvent() {
    this.$grid.contextmenu(($event: JQuery.Event) => {
      if (this._contextMenuGenerator) {
        contextMenuHelper.open(this._contextMenuGenerator(), $event.pageX, $event.pageY, $event);
      }
      return false;
    });
  }

  public accept(model: PageConfig) {
    model.register('remove.backgroundClass', (key, oldValue, newValue) => {
      this._$box.removeClass('background1 background2 background3 background4');
    });
    model.register('add.backgroundClass backgroundClass', (key, oldValue, newValue) => {
      this._$box.removeClass(oldValue).addClass(newValue);
    });
    model.register('remove.backgroundCustom', (key, oldValue, newValue) => {
      this._$box.css({
        backgroundImage: `none`
      });
    });
    model.register('add.backgroundCustom backgroundCustom', (key, oldValue, newValue) => {
      console.log(newValue);
      newValue.dataUrl && this._$box.css({
        backgroundImage: `url(${newValue.dataUrl})`
      });
    });
    model.register('remove.backgroundColor', (key, oldValue, newValue) => {
      this._$box.css({
        backgroundColor: 'transparent'
      });
    });
    model.register('add.backgroundColor backgroundColor', (key, oldValue, newValue) => {
      this._$box.css({
        backgroundColor: newValue
      });
    });
    model.register('auxiliaryLine', (key, oldValue, newValue) => {
      this.$grid.toggleClass('help-lines', newValue);
    });
    model.register('width add.width', (key, oldValue, newValue) => {
      this._width = newValue;
      this._refresh();
    });
    model.register('height add.height', (key, oldValue, newValue) => {
      this._height = newValue;
      this._refresh();
    });
  }

  destroy() {

  }
}
