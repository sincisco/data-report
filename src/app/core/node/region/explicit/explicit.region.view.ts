import {RegionView} from '../region.view';
import {IRegionModel, RegionModel, RegionState} from '../region.model';
import {Region} from '../region';
import {fromEvent, Subscription} from 'rxjs';
import {BarChartGraphic} from '../../graphic/chart.graphic/bar.chart.graphic';
import {TextAuxiliary} from '../../graphic.view/auxiliary/text.auxiliary';
import {LinesChartGraphic} from '../../graphic/chart.graphic/lines.chart.graphic';
import {LineChartGraphic} from '../../graphic/chart.graphic/line.chart.graphic';
import {TextGraphic} from '../../graphic/auxiliary.graphic/text.graphic';
import {CoordinatesAndDimensions} from '../../interface';
import {clipboard} from '../../clipboard';
import {filter, throttleTime} from 'rxjs/internal/operators';
import {closestNum} from '../../../../utils/common';
import {PieChartGraphic} from '../../graphic/chart.graphic/pie.chart.graphic';
import {resizeTipHelper} from '../../helper/resize.tip.helper';
import {contextMenuHelper} from '../../../../utils/contextMenu';

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

export class ExplicitRegionView extends RegionView {

  $fill: JQuery;
  private _$mover: JQuery;

  constructor(private _controller: Region, private _model: IRegionModel) {
    super();

    this.$element = $(template);
    this.$fill = this.$element.find('.g-fill');
    this._$mover = this.$element.find('.u-mover');

    // 监听model变化
    this.listenToModel(_model);
    this.refresh();
    setTimeout(() => {
      this._bindEvent();
    }, 10);
  }

  listenToModel(model: IRegionModel) {
    model.register('state', (key, oldValue, newValue, option) => {
      console.log(key, oldValue, newValue);
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
          break;
        case RegionState.selected:
          this.$element.addClass('selected');
          break;
        case RegionState.multiSelected:
          this.$element.addClass('multi-selected');
          break;
      }
    });
  }

  refresh() {
    this.$element.css({
      width: this._model.width,
      height: this._model.height,
      left: this._model.left,
      top: this._model.top
    });
    if (this._model.state === RegionState.activated) {
      this._controller.regionResize();
    }
  }

  private _bindEvent() {
    this._bindEventForResize();
    this._bindEventForMover();
    this._bindContextEvent();
  }

  private _bindEventForResize() {
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
        // this.page.activateRegion(this);
      });
  }


  private _bindContextEvent() {
    this._$mover.contextmenu(($event: JQuery.Event) => {
      contextMenuHelper.open([
        {
          displayName: '复制',
          shortcut: 'Ctrl+C',
          callback: () => {
            console.log('复制');
            // clipboard.saveData(this.getOption());
            // console.log(this.getOption());
            // clipboard.saveData(this.derender());
            // console.log(this.derender());
            // contextMenuHelper.close();
          }
        }, {
          displayName: '剪切',
          shortcut: 'Ctrl+X'
        }, {
          displayName: '删除',
          shortcut: 'Backspace',
          callback: () => {
            // if (this.page.selectManager.include(this)) {
            //   const arr = this.page.selectManager.selectedArray;
            //   arr.forEach((value) => {
            //     value.destroy();
            //   });
            // } else {
            //   this.destroy();
            // }

            contextMenuHelper.close();
          }
        }, 'split',
        {
          displayName: '创建bar Echart',
          callback: () => {
            // const _graphic = new BarChartGraphic(this);
            //
            // _graphic.init();
            // // 使用刚指定的配置项和数据显示图表。
            // // content.init({});
            //
            // contextMenuHelper.close();
          }
        },
        {
          displayName: '创建line Echart',
          callback: () => {
            // const _graphic = new LineChartGraphic(this);
            //
            // _graphic.init();
            // // 使用刚指定的配置项和数据显示图表。
            // // content.init({});
            //
            // contextMenuHelper.close();
          }
        },
        {
          displayName: '创建pie Echart',
          callback: () => {
            // const _graphic = new PieChartGraphic(this);
            //
            // _graphic.init();
            // // 使用刚指定的配置项和数据显示图表。
            // // content.init({});
            //
            // contextMenuHelper.close();
          }
        }, {
          displayName: '创建Header',
          callback: () => {
            // var content = this._content = new HeaderHtml(this.$frame[0]);
            // console.log(content);
            // var option = {
            //   text: '英特尔 Xeon(至强)'
            // };
            //
            // // 使用刚指定的配置项和数据显示图表。
            // content.init(option);
          }
        }, {
          displayName: '创建Paragraph',
          callback: () => {
            // const _graphic = this._graphic = new TextGraphic(this);
            // const option = {
            //   text: '英特尔 Xeon(至强)'
            // };
            //
            // // 使用刚指定的配置项和数据显示图表。
            // _graphic.init(TextAuxiliary);
            // contextMenuHelper.close();
          }
        }, {
          displayName: '创建Comment',
          callback: () => {
            // var content = this._content = new CommentContent(this.$frame[0]);
            // console.log(content);
            // var option = {
            //   text: '英特尔 Xeon(至强)'
            // };
            //
            // // 使用刚指定的配置项和数据显示图表。
            // content.init(option);
          }
        }, {
          displayName: '创建Lines',
          callback: () => {
            // const _graphic = new LinesChartGraphic(this);
            //
            // _graphic.init();
            // // 使用刚指定的配置项和数据显示图表。
            // // content.init({});
            //
            // contextMenuHelper.close();
            // // var content = this._content = new TextContent(this.$frame[0]);
            // //
            // // // 使用刚指定的配置项和数据显示图表。
            // // content.init(option);
          }
        }
      ], $event.pageX, $event.pageY, $event);
      return false;
    });
  }


  destroy() {
    this.$element.remove();
  }
}
