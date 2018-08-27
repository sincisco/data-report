import {regionSelectHelper} from '@core/node/helper/region.select.helper';
import {ViewEventTarget, IEventSource, IView} from '@core/node/canvas/report/event';
import {graphicFactory} from '@core/node/factory/graphic.factory';
import {clipboard} from '@core/node/clipboard';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {MaskHelper} from '@core/node/helper/mask.helper';
import {PageModel} from '../../../../components/page.config/page.model';

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

export class ReportPageView implements IView {
  private _event = new ViewEventTarget();

  $element: JQuery;
  private readonly _$canvas: JQuery;
  private readonly _$box: JQuery;
  $grid: JQuery;

  maskHelper: MaskHelper;

  private _contextArray = [];

  constructor() {
    const $element = this.$element = $(TEMPLATE);

    this._$canvas = $element.find('.report-canvas');
    this._$box = $element.find('.report-box');

    this.$grid = $element.find('.report-grid');

    this.maskHelper = new MaskHelper($element.find('.u-edit-mask'));

    this._bindEvent();
  }

  maskRepaint($element) {
    this.maskHelper.repaint($element);
  }

  refresh(model: PageModel) {
    const width = model.width, height = model.height;

    this.$element.css({
      'width': width * model.scale + 50,
      'height': height * model.scale + 30
    });
    this._$canvas.css({
      width: width * model.scale,
      height: height * model.scale
    });
    this._$box.css('transform', `translate(-50%, -50%) scale(${model.scale})`);
    this.$grid.css({
      width,
      height
    });
  }

  private _bindEvent() {
    this.$grid
      .on('click', ($event) => {
        if ($event.target === this.$grid[0]) {
          this._event.dispatchEvent('select');
        }
      })
      .on('dragstart', ($event: JQuery.Event) => {
        const startPageX = $event.pageX, startPageY = $event.pageY;
        let left: number, top: number, width: number, height: number;
        const mousemove = (event: MouseEvent) => {
          regionSelectHelper.show(
            left = Math.min(startPageX, event.pageX),
            top = Math.min(startPageY, event.pageY),
            width = Math.abs(event.pageX - startPageX),
            height = Math.abs(event.pageY - startPageY));
        }, mouseup = (event: MouseEvent) => {
          document.removeEventListener('mousemove', mousemove);
          document.removeEventListener('mouseup', mouseup);
          regionSelectHelper.hide();
          this._event.dispatchEvent('regionSelect', left, top, width, height);
        };
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);

        regionSelectHelper.start($event.pageX, $event.pageY);
        return false;
      })
      .on('dragover', ($event: JQuery.Event) => {
        (<DragEvent>$event.originalEvent).dataTransfer.dropEffect = 'copyMove';
        $event.preventDefault();
      });
  }

  public listenToModel(model: PageModel) {
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
      newValue.backgroundDataUrl && this._$box.css({
        backgroundImage: `url(${newValue.backgroundDataUrl})`
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
    model.register('width', (key, oldValue, newValue) => {
      // this.$
    });
    model.register('height', (key, oldValue, newValue) => {
      // this.height = newValue;
      // this.refresh();
    });

  }

  public appendContext(array: Array<any>) {
    this._contextArray = this._contextArray.concat(array);
  }

  private _bindContextEvent() {
    this.$grid.contextmenu(($event: JQuery.Event) => {
      contextMenuHelper.open(this._contextArray, $event.pageX, $event.pageY, $event);
      return false;
    });
  }

  on(eventName: string, callback: Function) {
    this._event.addEventListener(eventName, callback);
    return this;
  }

  off(eventName: string, fn?: Function) {
    this._event.removeEventListener(eventName, fn);
    return this;
  }
}
