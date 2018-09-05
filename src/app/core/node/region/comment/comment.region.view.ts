import {RegionView} from '../region.view';
import {IRegionModel, RegionState} from '../region.model';
import {fromEvent, Subscription} from 'rxjs';
import {BarChartGraphic} from '../../graphic/chart.graphic/bar.chart.graphic';
import {TextAuxiliary} from '../../graphic.view/auxiliary/text.auxiliary';
import {LinesChartGraphic} from '../../graphic/chart.graphic/lines.chart.graphic';
import {LineChartGraphic} from '../../graphic/chart.graphic/line.chart.graphic';
import {TextGraphic} from '../../graphic/auxiliary.graphic/text.graphic';
import {CoordinatesAndDimensions, Dimensions} from '../../interface';
import {clipboard} from '../../clipboard';
import {filter, throttleTime} from 'rxjs/internal/operators';
import {closestNum} from '../../../../utils/common';
import {PieChartGraphic} from '../../graphic/chart.graphic/pie.chart.graphic';
import {resizeTipHelper} from '../../helper/resize.tip.helper';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {Region} from '../region';
import {RegionModel} from '@core/node/region/region.model';

const template = `
<div class="m-dashbox">
  <div class="u-resize">
    <div class="resize-topLeft draggable" data-which="resize-topLeft" draggable="true"></div>
    <div class="resize-top draggable" data-which="resize-top" draggable="true"></div>
    <div class="resize-topRight draggable" data-which="resize-topRight" draggable="true"></div>
    <div class="resize-right draggable" data-which="resize-right" draggable="true"></div>
    <div class="resize-bottomRight draggable" data-which="resize-bottomRight" draggable="true"></div>
    <div class="resize-bottom draggable" data-which="resize-bottom" draggable="true"></div>
    <div class="resize-bottomLeft draggable" data-which="resize-bottomLeft" draggable="true"></div>
    <div class="resize-left draggable" data-which="resize-left" draggable="true"></div>
  </div>
  <div class="g-fill u-graphic droppable"></div>
  <div class="u-mover"  draggable="true"></div>
  </div>
`;

export class CommentRegionView extends RegionView {

  private _defaultDimensions: Dimensions = {
    width: 30,
    height: 30
  };

  constructor(protected _controller: Region, protected _model: IRegionModel) {
    super();

    this.$element = $(template);
    this.$fill = this.$element.find('.g-fill');
    this._$mover = this.$element.find('.u-mover');

    this.listenToModel(_model);
    this.refresh();
    setTimeout(() => {
      this._bindEvent();
    }, 10);
  }

  listenToModel(model: IRegionModel) {
    model.register('state', (key, oldValue, newValue, option) => {
      switch (oldValue) {
        case RegionState.selected:
          this.$element.removeClass('selected');
          break;
        case RegionState.multiSelected:
          this.$element.removeClass('multi-selected');
          break;
      }
      switch (newValue) {
        case RegionState.default:
          this.refresh();
          break;
        case RegionState.selected:
          this.$element.addClass('selected');
          this.refresh();
          break;
        case RegionState.multiSelected:
          this.$element.addClass('multi-selected');
          break;
      }
    });
  }

  refresh() {
    if (this._model.state === RegionState.default) {
      this.$element.css({
        width: this._defaultDimensions.width,
        height: this._defaultDimensions.height,
        left: this._model.left,
        top: this._model.top
      });
    } else if (this._model.state === RegionState.selected) {
      this.$element.css({
        width: this._model.width,
        height: this._model.height,
        left: this._model.left,
        top: this._model.top
      });
    }
    if (this._model.state === RegionState.activated) {
      this._controller.regionResize();
    }
  }

  private _bindEvent() {
    let count = 0,
      offsetX, offsetY,
      offset: JQuery.Coordinates,
      snapshot: CoordinatesAndDimensions,
      _which: string;
    const _handleResize = (pageX, pageY) => {
      const model = this._model;
      switch (_which) {
        case 'resize-left':
          if (pageX < (offset.left + snapshot.width)) {
            offsetX = closestNum(pageX - offset.left);
            model.left = snapshot.left + offsetX;
            model.width = snapshot.width - offsetX;
          }
          break;
        case 'resize-top':
          if (pageY < (offset.top + snapshot.height)) {
            offsetY = closestNum(pageY - offset.top);
            model.top = snapshot.top + offsetY;
            model.height = snapshot.height - offsetY;
          }
          break;
        case 'resize-right':
          if (pageX > offset.left) {
            model.width = closestNum(pageX - offset.left);
            // this.zoom(closestNum(pageX - offset.left), 0, true);
          }
          break;
        case 'resize-topLeft':
          if (pageY < (offset.top + snapshot.height) && pageX < (offset.left + snapshot.width)) {
            offsetX = closestNum(pageX - offset.left),
              offsetY = closestNum(pageY - offset.top);
            model.left = snapshot.left + offsetX;
            model.width = snapshot.width - offsetX;
            model.top = snapshot.top + offsetY;
            model.height = snapshot.height - offsetY;
          }
          break;
        case 'resize-topRight':
          if (pageY < (offset.top + snapshot.height)) {
            offsetY = closestNum(pageY - offset.top);
            model.top = snapshot.top + offsetY;
            model.height = snapshot.height - offsetY;
          }
          if (pageX > offset.left) {
            model.width = closestNum(pageX - offset.left);
          }
          break;
        case 'resize-bottomRight':
          if (pageX > offset.left) {
            model.width = pageX - offset.left;
          }
          if (pageY > offset.top) {
            model.height = pageY - offset.top;
          }
          break;
        case 'resize-bottomLeft':
          if (pageX < (offset.left + snapshot.width)) {
            offsetX = closestNum(pageX - offset.left);
            model.left = snapshot.left + offsetX;
            model.width = snapshot.width - offsetX;
          }
          if (pageY > offset.top) {
            model.height = pageY - offset.top;
          }
          break;
        case 'resize-bottom':
          if (pageY > offset.top) {
            model.height = pageY - offset.top;
          }
          break;

      }
    };

    let subscription: Subscription;
    const dragEndHelper = (event: MouseEvent) => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
        document.removeEventListener('mouseup', dragEndHelper);
        this.$element.removeClass('no-transition');
        resizeTipHelper.hide();
        _handleResize(event.pageX, event.pageY);
        this._event.dispatchEvent('resizeEnd');
      }
    };

    this.$element.find('div.u-resize>.draggable')
      .on('dragstart', ($event: JQuery.Event) => {
        count = 0;
        offset = this.$element.offset();
        snapshot = Object.assign(this._model.coordinates, this._model.dimensions);
        _which = (<HTMLElement>$event.currentTarget).dataset.which;
        resizeTipHelper.show($event.pageX, $event.pageY, this._model.width, this._model.height);
        this.$element.addClass('no-transition');

        subscription = fromEvent(document, 'mousemove')
          .pipe(throttleTime(30))
          .subscribe((mouseEvent: MouseEvent) => {
            _handleResize(mouseEvent.pageX, mouseEvent.pageY);
            resizeTipHelper.refresh(mouseEvent.pageX, mouseEvent.pageY, this._model.width, this._model.height);
            this.refresh();
          });
        document.addEventListener('mouseup', dragEndHelper);
        return false;
      });
    // 事件对象

    this._bindContextEvent();

    this._bindEventForMover();
  }

  private _bindContextEvent() {
    // this.$mover.contextmenu(($event: JQuery.Event) => {
    //   contextMenuHelper.open([
    //     {
    //       displayName: '复制',
    //       shortcut: 'Ctrl+C',
    //       callback: () => {
    //         console.log('复制');
    //       }
    //     }, {
    //       displayName: '剪切',
    //       shortcut: 'Ctrl+X'
    //     }, {
    //       displayName: '删除',
    //       shortcut: 'Backspace',
    //       callback: () => {
    //         if (this._graphic) {
    //           this._graphic.destroy();
    //         }
    //         this.destroy();
    //         contextMenuHelper.close();
    //       }
    //     }, 'split', {
    //       displayName: '创建Paragraph',
    //       callback: () => {
    //         const _graphic = this._graphic = new CommentGraphic(this);
    //         const option = {
    //           text: '英特尔 Xeon(至强)'
    //         };
    //
    //         // 使用刚指定的配置项和数据显示图表。
    //         _graphic.init(CommentAuxiliary);
    //         contextMenuHelper.close();
    //       }
    //     }
    //   ], $event.pageX, $event.pageY, $event);
    //   return false;
    // });
  }

  destroy() {
    this.$element.remove();
  }
}
