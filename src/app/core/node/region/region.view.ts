import {View} from '@core/node/structure/view';
import {fromEvent, Subscription} from 'rxjs';
import {filter, throttleTime} from 'rxjs/internal/operators';
import {resizeTipHelper} from '@core/node/helper/resize.tip.helper';
import {Region} from '@core/node/region/region';
import {IRegionModel} from '@core/node/region/region.model';

export abstract class RegionView extends View {
  $fill: JQuery;

  protected _$mover: JQuery;
  protected _controller: Region;
  protected _model: IRegionModel;

  abstract refresh();

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
          .pipe(filter(event1 => count++ > 2), throttleTime(30))
          .subscribe((mouseEvent: MouseEvent) => {
            const offsetLeft = mouseEvent.pageX - originPageX,
              offsetTop = mouseEvent.pageY - originPageY;
            this._model.left = snapshot.left + Math.round(offsetLeft / this._controller.scale);
            this._model.top = snapshot.top + Math.round(offsetTop / this._controller.scale);

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

}
