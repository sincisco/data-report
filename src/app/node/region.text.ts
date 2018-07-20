import {Region, reportGlobal} from "./region";
import {Report} from "./report";
import {ChartBarNode} from "./chart.bar";
import {HeaderHtml} from "./header.html";
import {closestNum} from "../utils/common";
import {ContextMenuHelper} from "../utils/contextMenu";
import {fromEvent} from "rxjs";
import {filter, throttleTime} from "rxjs/internal/operators";


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
    <div class="m-rect m-rect-text" style="color: rgb(51, 51, 51); font-size: 12px; font-family: avenir, Helvetica, &quot;Microsoft YaHei&quot;, Arial, &quot;Hiragino Sans GB&quot;, sans-serif; background: rgb(175, 191, 255); border-radius: 0px; overflow-y: visible;">
  <div class="editor-wrap">
    <div class="editor medium-editor-element" 
    contenteditable="true" spellcheck="false" 
    data-medium-editor-element="true" role="textbox" 
    aria-multiline="true" data-medium-editor-editor-index="3" 
    medium-editor-index="a2ab70cd-432b-0ab5-91cb-a8ed9031c9f9" 
    data-placeholder="请输入文本" style="vertical-align: middle;">
      <p class="" style="text-align: center;">
      <font size="4" face="Microsoft YaHei, sans-serif" color="#0a8f08">vv而是这是顶顶顶顶</font>
      </p>
    </div>
  </div>
</div>
    </div>
  </div>
</div>`;
const mover = `<div class="u-mover"  draggable="true"></div>`;


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

export class RegionText {
  _report: Report;
  _coordinates: JQuery.Coordinates;
  dimensions: Dimensions;
  template: string = `
  <div class="node-wrapper">
  ${resizeHelper}
  ${graphic}
  ${mover}
  </div>
  `;
  dimension: IDimension = {
    left: 100,
    top: 100,
    width: 300,
    height: 200
  };
  offset: JQuery.Coordinates;
  snapshot: IDimension;
  $element: JQuery;
  $mover: JQuery;
  $frame: JQuery;
  _content: IContent;

  constructor() {
    this.$element = $(this.template);
    this.$mover = this.$element.find('.u-mover');
    this.$frame = this.$element.find('.graphic');
    this.refresh();
    setTimeout(() => {
      this._bindEvent();

    }, 1000);

  }

  setContent(content: IContent) {
    this._content = content;
  }

  private _which;

  private _bindEvent() {
    var originPageX, originPageY;
    var count = 0;


    this.$element.find('div.u-resize>.draggable')
      .on('dragstart', ($event: JQuery.Event) => {
        count = 0;
        this.$element.addClass('no-transition');
        this.offset = this.$element.offset();
        this.snapshot = Object.assign({}, this.dimension);

        var event: DragEvent = <DragEvent>$event.originalEvent;
        console.log('dragstart', event.pageX, event.pageY);
        event.dataTransfer.setData('text/plain', '123');
        var $targetResizer = $(event.currentTarget);
        this._which = $targetResizer.data('which');
      }).on('dragend', ($event: JQuery.Event) => {
      var event: DragEvent = <DragEvent>$event.originalEvent;
      console.log('dragend', event.pageX, event.pageY);
      this.$element.removeClass('no-transition');
      this._content && this._content.resize();
      this.handleResize(event.pageX, event.pageY);
    });

    var draggableDrag = fromEvent(this.$element.find('div.u-resize>.draggable'), 'drag');


    draggableDrag.pipe(filter(ev => count++ > 2), throttleTime(200)).subscribe((event: DragEvent) => {
      console.log('drag', event.pageX, event.pageY);
      if (event.pageX === 0 && event.pageY === 0)
        return;
      this.handleResize(event.pageX, event.pageY);
    }); // 事件对象


    this.$mover.on('dragstart', ($event: JQuery.Event) => {
      const event: DragEvent = <DragEvent>$event.originalEvent;
      event.dataTransfer.effectAllowed = 'move';
      originPageX = $event.pageX;
      originPageY = $event.pageY;
      const position = this.$element.position();
      this.snapshot = Object.assign({}, this.dimension);
      console.log('pageX', originPageX, 'pageY', originPageY);
      console.log('*******************************');
      count = 0;
    }).on('click', ($event) => {
      this.$element.toggleClass('activated');
      if (this.$element.hasClass('activated') && this._content) {
        reportGlobal.instance = this._content;
        this._content.activate();
      }
    }).dblclick(()=>{
      this.$element.toggleClass('deep-activated');
    });

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
        }
      ], $event);
      return false;
    });


    var moverDrag = fromEvent(this.$mover[0], 'drag');

    moverDrag.pipe(filter(ev => count++ > 2), throttleTime(100)).subscribe(($event: DragEvent) => {
      if ($event.pageX === 0 && $event.pageY === 0)
        return;
      var offsetLeft = $event.pageX - originPageX,
        offsetTop = $event.pageY - originPageY;
      console.log('pageX', $event.pageX, 'pageY', $event.pageY);
      console.log(offsetLeft, offsetTop);
      this.dimension.left = this.snapshot.left + Math.round(offsetLeft / this._report.scale);
      this.dimension.top = this.snapshot.top + Math.round(offsetTop / this._report.scale);
      console.log();
      this.refresh();

    }); // 事件对象


    this.$mover[0].addEventListener('dragend', function (event) {
      // store a ref. on the dragged elem
      console.log('dragend', event);
    }, false);
  }

  unselect() {
    this.$element.removeClass('activated');
  }

  set report(param: Report) {
    this._report = param;
  }

  public handleResize(pageX, pageY) {
    var region: RegionText = this,
      offset = this.offset,
      dimension = this.dimension,
      snapshot = this.snapshot;
    switch (this._which) {
      case 'resize-left':
        if (pageX < (offset.left + snapshot.width)) {
          var offsetX = closestNum(pageX - offset.left);
          dimension.left = snapshot.left + offsetX;
          dimension.width = snapshot.width - offsetX;
        }
        break;
      case 'resize-top':
        if (pageY < (offset.top + snapshot.height)) {
          var offsetY = pageY - offset.top;
          dimension.top = snapshot.top + offsetY;
          dimension.height = snapshot.height - offsetY;
        }
        break;
      case 'resize-right':
        if (pageX > offset.left) {
          dimension.width = closestNum(pageX - offset.left);
        }
        break;
      case 'resize-topLeft':
        if (pageY < (offset.top + snapshot.height) && pageX < (offset.left + snapshot.width)) {
          var offsetX = closestNum(pageX - offset.left),
            offsetY = pageY - offset.top;
          dimension.left = snapshot.left + offsetX;
          dimension.width = snapshot.width - offsetX;
          dimension.top = snapshot.top + offsetY;
          dimension.height = snapshot.height - offsetY;
        }
        break;
      case 'resize-topRight':
        if (pageY < (offset.top + snapshot.height)) {
          var offsetY = pageY - offset.top;
          dimension.top = snapshot.top + offsetY;
          dimension.height = snapshot.height - offsetY;
        }
        if (pageX > offset.left) {
          dimension.width = closestNum(pageX - offset.left);
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
          dimension.left = snapshot.left + offsetX;
          dimension.width = snapshot.width - offsetX;
        }
        if (pageY > offset.top) {
          dimension.height = pageY - offset.top;
        }
        break;
      case 'resize-bottom':
        if (pageY > offset.top) {
          dimension.height = pageY - offset.top;
        }
        break;

    }
    this.refresh();
  }

  coordinates(left, top) {
    this.dimension.left = left;
    this.dimension.top = top;
  }

  get width() {
    return this.dimension.width;
  }

  get height() {
    return this.dimension.height;
  }

  set width(width) {
    this.dimension.width = width;
  }

  set height(height) {
    this.dimension.height = height;
  }


  refresh() {
    this.$element.css({
      width: closestNum(this.dimension.width),
      height: closestNum(this.dimension.height),
      left: closestNum(this.dimension.left),
      top: closestNum(this.dimension.top)
    });
  }
}
