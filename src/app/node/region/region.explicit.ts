import {Region, RegionState, resizeTipHelper} from './region';
import {ChartBarNode} from '../content/chart/chart.bar';
import {HeaderHtml} from '../content/html/header.html';
import {closestNum} from '../../utils/common';
import {contextMenuHelper} from '../../utils/contextMenu';
import {fromEvent, Subscription} from 'rxjs';
import {throttleTime} from 'rxjs/internal/operators';
import {HtmlParagraph} from '../content/html/paragraph.html';
import {HtmlImage} from '../content/html/image.html';
import {CommentContent} from '../content/comment.content';
import {TextContent} from '../content/text.content';
import {CoordinatesAndDimensions, Dimensions} from '../interface';
import {GraphicChart} from '../graphic/graphic.chart';

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
  <div class="g-fill u-graphic droppable">
  </div>
  <div class="u-mover"  draggable="true"></div>
  </div>
`;

export class ExplicitRegion extends Region {
  private _dimensions: Dimensions = {
    width: 300,
    height: 200
  };

  $host: JQuery;
  $fill: JQuery;

  constructor() {
    super(template);
    this._coordinates = {
      left: 100,
      top: 100
    };
    this.$host = this.$element;
    this.$fill = this.$element.find('.u-graphic');
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

  refresh() {
    this.$element.css({
      width: this._dimensions.width,
      height: this._dimensions.height,
      left: this._coordinates.left,
      top: this._coordinates.top
    });
    if (this._regionState === RegionState.activated) {
      this.report.regionResize(this);
    }
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
            dimensions.width = closestNum(pageX - offset.left);
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
        this._graphic && this._graphic.resize();
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
          shortcut: 'Backspace'
        }, 'split',
        {
          displayName: '创建Echart',
          callback: () => {
            var _graphic = this._graphic = new GraphicChart(this);

            _graphic.init(ChartBarNode);
            // 使用刚指定的配置项和数据显示图表。
            // content.init({});

            contextMenuHelper.close();
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
            // var content = this._content = new HtmlParagraph(this.$frame[0]);
            // console.log(content);
            // var option = {
            //   text: '英特尔 Xeon(至强)'
            // };
            //
            // // 使用刚指定的配置项和数据显示图表。
            // content.init(option);
          }
        }, {
          displayName: '创建Image',
          callback: () => {
            // var content = this._content = new HtmlImage(this.$frame[0]);
            // console.log(content);
            // var option = {
            //   text: '英特尔 Xeon(至强)'
            // };
            //
            // // 使用刚指定的配置项和数据显示图表。
            // content.init(option);
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
          displayName: '创建Text',
          callback: () => {
            // var content = this._content = new TextContent(this.$frame[0]);
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

    super._bindEventForMover();
  }

}
