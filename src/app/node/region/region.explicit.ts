import {Region, reportGlobal} from './region';
import {Report} from '../report';
import {ChartBarNode} from '../chart.bar';
import {HeaderHtml} from '../html/header.html';
import {closestNum} from '../../utils/common';
import {ContextMenuHelper} from '../../utils/contextMenu';
import {fromEvent} from 'rxjs';
import {filter, throttleTime} from 'rxjs/internal/operators';
import {HtmlParagraph} from '../html/paragraph.html';
import {HtmlImage} from '../html/image.html';


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

interface Dimensions {
  width: number;
  height: number;
}

interface IDimension {
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
  snapshot: IDimension;


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
                text: 'ECharts 入门示例'
              },
              dataset: {
                // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
                // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
                dimensions: ['product', '2015', '2016', '2017'],
                source: [
                  {product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7},
                  {product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1},
                  {product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5},
                  {product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1}
                ]
              },
              tooltip: {},
              legend: {
                data: ['销量', '销量1']
              },
              xAxis: {
                type: 'category'
              },
              yAxis: {},
              series: [{type: 'bar'},
                {type: 'bar'}]
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
        }
      ], $event);
      return false;
    });

    super._bindEventForMover();
  }

  private _handleResize(pageX, pageY) {
    var region: ExplicitRegion = this,
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


  select() {
    this.$element.addClass('activated');
  }

  unselect() {
    this.$element.removeClass('selected');
  }

  activate() {

  }

  deactivate() {
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
  }
}
