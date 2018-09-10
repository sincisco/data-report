import {View} from '@core/node/structure/view';
import {fromEvent, Subscription} from 'rxjs';
import {throttleTime} from 'rxjs/internal/operators';
import {resizeTipHelper} from '@core/node/helper/resize.tip.helper';
import {RegionController} from '@core/node/region/region.controller';
import {IRegionModel} from '@core/node/region/region.model';
import {CoordinatesAndDimensions} from '@core/node/interface';
import {closestNum} from '../../../utils/common';
import {contextMenuHelper, ContextMenuItem} from '../../../utils/contextMenu';

type IContextMenuGenerator = () => Array<ContextMenuItem | 'split'>;

export abstract class RegionView extends View {
  $fill: JQuery;

  protected _$mover: JQuery;
  protected _controller: RegionController;
  protected _model: IRegionModel;


  private _contextMenuGenerator: IContextMenuGenerator;

  set contextMenuGenerator(generator: IContextMenuGenerator) {
    this._contextMenuGenerator = generator;
  }

  abstract refresh();

  protected _bindEventForResize() {
    let offsetX, offsetY,
      offset: JQuery.Coordinates,
      snapshot: CoordinatesAndDimensions,
      which: string,
      subscription: Subscription;

    const handleResize = (pageX, pageY) => {
      const model = this._model;
      switch (which) {
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
    const dragEndHandler = (event: MouseEvent) => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
        document.removeEventListener('mouseup', dragEndHandler);
        this.$element.removeClass('no-transition');
        resizeTipHelper.hide();
        handleResize(event.pageX, event.pageY);
        this._event.dispatchEvent('resizeEnd');
      }
    };

    this.$element.find('div.u-resize>.draggable')
      .on('dragstart', ($event: JQuery.Event) => {
        offset = this.$element.offset();
        snapshot = Object.assign(this._model.coordinates, this._model.dimensions);
        which = (<HTMLElement>$event.currentTarget).dataset.which;
        resizeTipHelper.show($event.pageX, $event.pageY, this._model.width, this._model.height);
        this.$element.addClass('no-transition');

        // 监听鼠标移动
        subscription = fromEvent(document, 'mousemove')
          .pipe(throttleTime(30))
          .subscribe((mouseEvent: MouseEvent) => {
            handleResize(mouseEvent.pageX, mouseEvent.pageY);
            resizeTipHelper.refresh(mouseEvent.pageX, mouseEvent.pageY, this._model.width, this._model.height);
            this.refresh();
          });
        // 解除对伸缩事件的监听
        document.addEventListener('mouseup', dragEndHandler);

        return false;
      });
    // 事件对象
  }

  /**
   * tips:
   * 1、被拖拽元素的z-index是否需要改变  以避免被其他高z-index的region覆盖
   * 2、如果要将一个region拖放到其他容器中，则当前region跟在鼠标后面移动的方式并不可行，因为drop事件会在被拖拽的元素上面触发
   * @private
   */
  protected _bindEventForMover() {
    let count = 0,
      subscription: Subscription,
      originPageX,
      originPageY,
      snapshot: JQuery.Coordinates;

    const dragEndHandler = (event: MouseEvent) => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
        document.removeEventListener('mouseup', dragEndHandler);
        this.$element.removeClass('no-transition');
        resizeTipHelper.hide();
      }
    };

    let timeoutHandle;
    this._$mover
      .on('dragstart', ($event: JQuery.Event) => {
        count = 0;
        this.$element.addClass('no-transition');
        originPageX = $event.pageX;
        originPageY = $event.pageY;
        snapshot = this._model.coordinates;
        resizeTipHelper.show(originPageX, originPageY, snapshot.left, snapshot.top);

        subscription = fromEvent(document, 'mousemove')
          .pipe(throttleTime(30))
          .subscribe((mouseEvent: MouseEvent) => {
            const offsetLeft = mouseEvent.pageX - originPageX,
              offsetTop = mouseEvent.pageY - originPageY;
            this._model.left = snapshot.left + Math.round(offsetLeft / this._controller.scale);
            this._model.top = snapshot.top + Math.round(offsetTop / this._controller.scale);
            console.log(this._model.left, this._model.top);
            resizeTipHelper.refresh(mouseEvent.pageX, mouseEvent.pageY, this._model.left, this._model.top);
            this.refresh();
          });
        document.addEventListener('mouseup', dragEndHandler);
        return false;
      })
      .on('click', ($event: JQuery.Event) => {
        // console.log('click');
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
          timeoutHandle = null;
        } else {
          timeoutHandle = setTimeout(() => {
            $($event.currentTarget).triggerHandler('singleClick', [$event]);
            timeoutHandle = null;
          }, 200);
        }
        $event.stopPropagation();
      })
      .on('singleClick', ($event: JQuery.Event, $singleClickEvent: JQuery.Event) => {
        console.log('singleClick');
        if ($singleClickEvent.ctrlKey) {
          console.log('ctrl');
          this._event.dispatchEvent('ctrlSelect');
        } else {
          this._event.dispatchEvent('select');
        }

      })
      .on('dblclick', ($event: JQuery.Event) => {
        console.log('dblclick');
        this._event.dispatchEvent('activateRegion');
      });
  }

  protected _bindContextEvent() {
    this._$mover.contextmenu(($event: JQuery.Event) => {
      contextMenuHelper.open(this._contextMenuGenerator(), $event.pageX, $event.pageY, $event);
      return false;
    });
  }
}
