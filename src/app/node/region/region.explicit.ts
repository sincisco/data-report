import {Region, RegionState, reportGlobal} from './region';
import {Report} from '../canvas/report';
import {ChartBarNode} from '../content/chart/chart.bar';
import {HeaderHtml} from '../content/html/header.html';
import {closestNum} from '../../utils/common';
import {ContextMenuHelper} from '../../utils/contextMenu';
import {fromEvent} from 'rxjs';
import {filter, throttleTime} from 'rxjs/internal/operators';
import {HtmlParagraph} from '../content/html/paragraph.html';
import {HtmlImage} from '../content/html/image.html';
import {CommentContent} from '../content/comment.content';
import {TextContent} from '../content/text.content';
import {Dimensions} from '../interface';


const resizeHelper = `
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
`;
const graphic = `
<div class="graphic-wrapper">
  <div class="frame">
    <div class="graphic">
    </div>
  </div>
</div>`;

interface CoordinatesAndDimensions {
  left: number;
  top: number;
  width: number;
  height: number;
}

export class ExplicitRegion extends Region {
  private _dimensions: Dimensions = {
    width: 300,
    height: 200
  };

  $frame: JQuery;

  offset: JQuery.Coordinates;
  snapshot: CoordinatesAndDimensions;


  constructor() {
    super([resizeHelper, graphic]);
    this._coordinates = {
      left: 100,
      top: 100
    };
    this.$frame = this.$element.find('.graphic');
    this.refresh();
    setTimeout(() => {
      this._bindEvent();
    }, 10);
  }

  setContent(content: IContent) {
    this._content = content;
  }

  private _which;

  private _bindEvent() {
    var count = 0;

    this.$element.find('div.u-resize>.draggable')
      .on('dragstart', ($event: JQuery.Event) => {
        count = 0;
        this.$element.addClass('no-transition');
        this.offset = this.$element.offset();
        this.snapshot = Object.assign({}, this._dimensions, this._coordinates);

        this._which = (<HTMLElement>$event.currentTarget).dataset.which;

        console.log('u-resize dragstart', $event.pageX, $event.pageY);
      }).on('dragend', ($event: JQuery.Event) => {
      var event: DragEvent = <DragEvent>$event.originalEvent;
      console.log('u-resize dragend', event.pageX, event.pageY);
      this.$element.removeClass('no-transition');
      this._handleResize(event.pageX, event.pageY);
      this._content && this._content.resize();
    });

    var draggableDrag = fromEvent(this.$element.find('div.u-resize>.draggable'), 'drag');

    draggableDrag.pipe(filter(ev => count++ > 2), throttleTime(200)).subscribe((event: DragEvent) => {
      console.log('drag', event.pageX, event.pageY);
      if (event.pageX === 0 && event.pageY === 0)
        return;
      this._handleResize(event.pageX, event.pageY);
    }); // 事件对象


    this.$mover.contextmenu(($event: JQuery.Event) => {
      ContextMenuHelper.open([
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
            var content = this._content = new ChartBarNode(this.$frame[0]);
            var option = {
              title: {
                text: '我是一个图表'
              },
              tooltip: {},
              /*              legend: {
                              data: ['销量', '销量1']
                            },*/
              xAxis: {
                type: 'category'
              },
              yAxis: {type: 'value'},
              series: [/*{type: 'bar'},
                {type: 'bar'}*/]
            };

            // 使用刚指定的配置项和数据显示图表。
            content.init(option);
          }
        }, {
          displayName: '创建Header',
          callback: () => {
            var content = this._content = new HeaderHtml(this.$frame[0]);
            console.log(content);
            var option = {
              text: '英特尔 Xeon(至强)'
            };

            // 使用刚指定的配置项和数据显示图表。
            content.init(option);
          }
        }, {
          displayName: '创建Paragraph',
          callback: () => {
            var content = this._content = new HtmlParagraph(this.$frame[0]);
            console.log(content);
            var option = {
              text: '英特尔 Xeon(至强)'
            };

            // 使用刚指定的配置项和数据显示图表。
            content.init(option);
          }
        }, {
          displayName: '创建Image',
          callback: () => {
            var content = this._content = new HtmlImage(this.$frame[0]);
            console.log(content);
            var option = {
              text: '英特尔 Xeon(至强)'
            };

            // 使用刚指定的配置项和数据显示图表。
            content.init(option);
          }
        }, {
          displayName: '创建Comment',
          callback: () => {
            var content = this._content = new CommentContent(this.$frame[0]);
            console.log(content);
            var option = {
              text: '英特尔 Xeon(至强)'
            };

            // 使用刚指定的配置项和数据显示图表。
            content.init(option);
          }
        }, {
          displayName: '创建Text',
          callback: () => {
            var content = this._content = new TextContent(this.$frame[0]);
            console.log(content);
            var option = {
              text: '英特尔 Xeon(至强)'
            };

            // 使用刚指定的配置项和数据显示图表。
            content.init(option);
          }
        }
      ], $event);
      return false;
    });

    super._bindEventForMover();
  }

  private _handleResize(pageX, pageY) {
    let region: ExplicitRegion = this,
      offset = this.offset,
      dimensions = this._dimensions,
      coordinates = this._coordinates,
      snapshot = this.snapshot;
    switch (this._which) {
      case 'resize-left':
        if (pageX < (offset.left + snapshot.width)) {
          var offsetX = closestNum(pageX - offset.left);
          coordinates.left = snapshot.left + offsetX;
          dimensions.width = snapshot.width - offsetX;
        }
        break;
      case 'resize-top':
        if (pageY < (offset.top + snapshot.height)) {
          var offsetY = pageY - offset.top;
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
          var offsetX = closestNum(pageX - offset.left),
            offsetY = pageY - offset.top;
          coordinates.left = snapshot.left + offsetX;
          dimensions.width = snapshot.width - offsetX;
          coordinates.top = snapshot.top + offsetY;
          dimensions.height = snapshot.height - offsetY;
        }
        break;
      case 'resize-topRight':
        if (pageY < (offset.top + snapshot.height)) {
          var offsetY = pageY - offset.top;
          coordinates.top = snapshot.top + offsetY;
          dimensions.height = snapshot.height - offsetY;
        }
        if (pageX > offset.left) {
          dimensions.width = closestNum(pageX - offset.left);
        }
        break;
      case 'resize-bottomRight':
        if (pageX > offset.left) {
          region.width = pageX - offset.left;
        }
        if (pageY > offset.top) {
          region.height = pageY - offset.top;
        }
        break;
      case 'resize-bottomLeft':
        if (pageX < (offset.left + snapshot.width)) {
          var offsetX = pageX - offset.left;
          coordinates.left = snapshot.left + offsetX;
          dimensions.width = snapshot.width - offsetX;
        }
        if (pageY > offset.top) {
          dimensions.height = pageY - offset.top;
        }
        break;
      case 'resize-bottom':
        if (pageY > offset.top) {
          dimensions.height = pageY - offset.top;
        }
        break;

    }
    this.refresh();
  }


  set report(param: Report) {
    this._report = param;
  }

  get report() {
    return this._report;
  }

  setCoordinates(left, top) {
    this._coordinates.left = left;
    this._coordinates.top = top;
  }

  get width() {
    return this._dimensions.width;
  }

  get height() {
    return this._dimensions.height;
  }

  set width(width) {
    this._dimensions.width = width;
  }

  set height(height) {
    this._dimensions.height = height;
  }


  refresh() {
    this.$element.css({
      width: closestNum(this._dimensions.width),
      height: closestNum(this._dimensions.height),
      left: closestNum(this._coordinates.left),
      top: closestNum(this._coordinates.top)
    });
    if (this._regionState === RegionState.activated) {
      this.report.regionResize(this);
    }
  }
}
