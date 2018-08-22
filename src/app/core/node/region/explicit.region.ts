import {Region, RegionState, resizeTipHelper} from './region';
import {BarChart} from '../content/chart/bar.chart';
import {closestNum} from '../../../utils/common';
import {contextMenuHelper} from '../../../utils/contextMenu';
import {fromEvent, Subscription} from 'rxjs';
import {throttleTime} from 'rxjs/internal/operators';
import {TextAuxiliary} from '../content/auxiliary/text.auxiliary';
import {ImageAuxiliary} from '../content/auxiliary/image.auxiliary';
import {CoordinatesAndDimensions, Dimensions} from '../interface';
import {ChartGraphic} from '../graphic/chart.graphic';
import {ImageGraphic} from '../graphic/image.graphic';
import {IGraphic} from '../graphic/graphic';
import {TextGraphic} from '../graphic/text.graphic';
import {LineChart} from '@core/node/content/chart/line.chart';
import {PieChart} from '@core/node/content/chart/pie.chart';
import {LinesChart} from '@core/node/content/chart/lines.chart';
import {clipboard} from '@core/node/clipboard';

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

export class ExplicitRegion extends Region {
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

  /**
   * 模型层关联，展现层关联
   * @param {IGraphic} graphic
   */
  addChild(graphic: IGraphic) {
    this._graphic = graphic;
    this.$fill.append(graphic.$element);
  }

  getOption() {
    if (this._graphic) {
      return Object.assign({graphic: this._graphic.getOption(), graphicClass: this._graphic.constructor}, this._dimensions);
    }
  }

  derender() {
    return {
      regionClass: 'explicit.region',
      option: {
        dimensions: Object.assign({}, this._dimensions)
      }
    };
  }

  render(option) {
    this._dimensions = option.dimensions;
  }

  private _bindEvent() {

    this._bindEventForResize();

    this._bindContextEvent();

    super._bindEventForMover();
  }

  private _bindEventForResize() {
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
  }

  private _bindContextEvent() {
    this.$mover.contextmenu(($event: JQuery.Event) => {
      contextMenuHelper.open([
        {
          displayName: '复制',
          shortcut: 'Ctrl+C',
          callback: () => {
            console.log('复制');
            // clipboard.saveData(this.getOption());
            // console.log(this.getOption());
            clipboard.saveData(this.derender());
            console.log(this.derender());
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
        }, 'split',
        {
          displayName: '创建bar Echart',
          callback: () => {
            const _graphic = new ChartGraphic(this);

            _graphic.init(BarChart);
            // 使用刚指定的配置项和数据显示图表。
            // content.init({});

            contextMenuHelper.close();
          }
        },
        {
          displayName: '创建line Echart',
          callback: () => {
            const _graphic = new ChartGraphic(this);

            _graphic.init(LineChart);
            // 使用刚指定的配置项和数据显示图表。
            // content.init({});

            contextMenuHelper.close();
          }
        },
        {
          displayName: '创建pie Echart',
          callback: () => {
            const _graphic = new ChartGraphic(this);

            _graphic.init(PieChart);
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
            const _graphic = this._graphic = new TextGraphic(this);
            const option = {
              text: '英特尔 Xeon(至强)'
            };

            // 使用刚指定的配置项和数据显示图表。
            _graphic.init(TextAuxiliary);
            contextMenuHelper.close();
          }
        }, {
          displayName: '创建Image',
          callback: () => {
            const _graphic = this._graphic = new ImageGraphic(this);

            _graphic.init(ImageAuxiliary);
            // 使用刚指定的配置项和数据显示图表。
            // content.init({});

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
        }, {
          displayName: '创建Lines',
          callback: () => {
            const _graphic = new ChartGraphic(this);

            _graphic.init(LinesChart);
            // 使用刚指定的配置项和数据显示图表。
            // content.init({});

            contextMenuHelper.close();
            // var content = this._content = new TextContent(this.$frame[0]);
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
