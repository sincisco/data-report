import {Region, RegionState, reportGlobal, resizeTipHelper} from './region';
import {closestNum} from '../../../utils/common';
import {contextMenuHelper} from '../../../utils/contextMenu';
import {fromEvent, Subscription} from 'rxjs';
import {throttleTime} from 'rxjs/internal/operators';
import {TextAuxiliary} from '../content/auxiliary/text.auxiliary';
import {CoordinatesAndDimensions, Dimensions} from '../interface';
import {IGraphic} from '../graphic/graphic';
import {TextGraphic} from '../graphic/text.graphic';
import {CommentGraphic} from '../graphic/comment.graphic';
import {CommentAuxiliary} from '../content/auxiliary/comment.auxiliary';

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

export class CommentRegion extends Region {
  private _defaultDimensions: Dimensions = {
    width: 30,
    height: 30
  };

  private _dimensions: Dimensions = {
    width: 300,
    height: 200
  };

  $fill: JQuery;

  constructor() {
    super(template);
    this._coordinates = {
      left: 100,
      top: 100
    };
    this.$fill = this.$element.find('.g-fill');
    this.refresh();
    setTimeout(() => {
      this._bindEvent();
    }, 10);
  }

  set width(width: number) {
    this._dimensions.width = closestNum(width);
  }

  set height(height: number) {
    this._dimensions.height = closestNum(height);
  }

  get width() {
    return this._dimensions.width;
  }

  get height() {
    return this._dimensions.height;
  }

  setCoordinates(left, top) {
    this._coordinates.left = left;
    this._coordinates.top = top;
  }

  select() {
    console.log('select');
    if (this._regionState === RegionState.selected) {
      return;
    }
    this._regionState = RegionState.selected;
    this.$element.addClass('selected');
    if (this._graphic) {
      reportGlobal.instance = this._graphic;
      this._graphic.activate();
    }
    this.refresh();
  }

  unselect() {
    if (this._regionState === RegionState.default) {
      return;
    }
    this._regionState = RegionState.default;
    this.$element.removeClass('selected');
    this.refresh();
  }

  setDimensions(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.refresh();
  }

  zoom(width: number, height: number, preserveAspectRatio?: boolean) {
    if (preserveAspectRatio) {
      height = (this.height * width) / this.width;
      this.setDimensions(width, height);
    } else {
      this.setDimensions(width, height);
    }
  }

  refresh() {
    if (this._regionState === RegionState.default) {
      this.$element.css({
        width: this._defaultDimensions.width,
        height: this._defaultDimensions.height,
        left: this._coordinates.left,
        top: this._coordinates.top
      });
    } else if (this._regionState === RegionState.selected) {
      this.$element.css({
        width: this._dimensions.width,
        height: this._dimensions.height,
        left: this._coordinates.left,
        top: this._coordinates.top
      });
    }
    if (this._regionState === RegionState.activated) {
      this.report.regionResize(this);
    }
  }

  addChild(graphic: IGraphic) {
    this._graphic = graphic;
    this.$fill.append(graphic.$element);
  }

  private _bindEvent() {
    let count = 0,
      offsetX, offsetY,
      offset: JQuery.Coordinates,
      snapshot: CoordinatesAndDimensions,
      _which: string;
    const _handleResize = (pageX, pageY) => {
      const coordinates = this._coordinates,
        dimensions = this._dimensions;
      switch (_which) {
        case 'resize-left':
          if (pageX < (offset.left + snapshot.width)) {
            offsetX = closestNum(pageX - offset.left);
            coordinates.left = snapshot.left + offsetX;
            dimensions.width = snapshot.width - offsetX;
          }
          break;
        case 'resize-top':
          if (pageY < (offset.top + snapshot.height)) {
            offsetY = closestNum(pageY - offset.top);
            coordinates.top = snapshot.top + offsetY;
            dimensions.height = snapshot.height - offsetY;
          }
          break;
        case 'resize-right':
          if (pageX > offset.left) {
            // dimensions.width = closestNum(pageX - offset.left);
            this.zoom(closestNum(pageX - offset.left), 0, true);
          }
          break;
        case 'resize-topLeft':
          if (pageY < (offset.top + snapshot.height) && pageX < (offset.left + snapshot.width)) {
            offsetX = closestNum(pageX - offset.left),
              offsetY = closestNum(pageY - offset.top);
            coordinates.left = snapshot.left + offsetX;
            dimensions.width = snapshot.width - offsetX;
            coordinates.top = snapshot.top + offsetY;
            dimensions.height = snapshot.height - offsetY;
          }
          break;
        case 'resize-topRight':
          if (pageY < (offset.top + snapshot.height)) {
            offsetY = closestNum(pageY - offset.top);
            coordinates.top = snapshot.top + offsetY;
            dimensions.height = snapshot.height - offsetY;
          }
          if (pageX > offset.left) {
            dimensions.width = closestNum(pageX - offset.left);
          }
          break;
        case 'resize-bottomRight':
          if (pageX > offset.left) {
            this.width = pageX - offset.left;
          }
          if (pageY > offset.top) {
            this.height = pageY - offset.top;
          }
          break;
        case 'resize-bottomLeft':
          if (pageX < (offset.left + snapshot.width)) {
            offsetX = closestNum(pageX - offset.left);
            coordinates.left = snapshot.left + offsetX;
            dimensions.width = snapshot.width - offsetX;
          }
          if (pageY > offset.top) {
            this.height = pageY - offset.top;
          }
          break;
        case 'resize-bottom':
          if (pageY > offset.top) {
            this.height = pageY - offset.top;
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
        if (this._graphic) {
          this._graphic.resize();
        }
      }
    };

    this.$element.find('div.u-resize>.draggable')
      .on('dragstart', ($event: JQuery.Event) => {
        count = 0;
        offset = this.$element.offset();
        snapshot = Object.assign({}, this._dimensions, this._coordinates);
        _which = (<HTMLElement>$event.currentTarget).dataset.which;
        resizeTipHelper.show($event.pageX, $event.pageY, this._dimensions.width, this._dimensions.height);
        this.$element.addClass('no-transition');

        subscription = fromEvent(document, 'mousemove')
          .pipe(throttleTime(30))
          .subscribe((mouseEvent: MouseEvent) => {
            _handleResize(mouseEvent.pageX, mouseEvent.pageY);
            resizeTipHelper.refresh(mouseEvent.pageX, mouseEvent.pageY, this._dimensions.width, this._dimensions.height);
            this.refresh();
          });
        document.addEventListener('mouseup', dragEndHelper);
        return false;
      });
    // 事件对象

    this._bindContextEvent();

    super._bindEventForMover();
  }

  private _bindContextEvent() {
    this.$mover.contextmenu(($event: JQuery.Event) => {
      contextMenuHelper.open([
        {
          displayName: '复制',
          shortcut: 'Ctrl+C',
          callback: () => {
            console.log('复制');
          }
        }, {
          displayName: '剪切',
          shortcut: 'Ctrl+X'
        }, {
          displayName: '删除',
          shortcut: 'Backspace',
          callback: () => {
            if (this._graphic) {
              this._graphic.destroy();
            }
            this.destroy();
            contextMenuHelper.close();
          }
        }, 'split', {
          displayName: '创建Paragraph',
          callback: () => {
            const _graphic = this._graphic = new CommentGraphic(this);
            const option = {
              text: '英特尔 Xeon(至强)'
            };

            // 使用刚指定的配置项和数据显示图表。
            _graphic.init(CommentAuxiliary);
            contextMenuHelper.close();
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
        }
      ], $event.pageX, $event.pageY, $event);
      return false;
    });
  }

}
