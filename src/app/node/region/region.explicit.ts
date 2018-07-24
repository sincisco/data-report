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
              dataset: {
                // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
                // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
                dimensions: ['学校', '省份', '城市', '本科毕业生人数', '硕士毕业生人数', '博士毕业生人数', '毕业生人数'],
                source: [
                  {'学校': '北京大学', '省份': '北京市', '城市': '北京市', '本科毕业生人数': '2645', '硕士毕业生人数': '3604', '博士毕业生人数': '1213', '毕业生人数': '7462'},
                  {'学校': '北京航空航天大学', '省份': '北京市', '城市': '北京市', '本科毕业生人数': '3105', '硕士毕业生人数': '2845', '博士毕业生人数': '437', '毕业生人数': '6387'},
                  {'学校': '北京理工大学', '省份': '北京市', '城市': '北京市', '本科毕业生人数': '3761', '硕士毕业生人数': '2818', '博士毕业生人数': '553', '毕业生人数': '7132'},
                  {'学校': '北京师范大学', '省份': '北京市', '城市': '北京市', '本科毕业生人数': '2455', '硕士毕业生人数': '3476', '博士毕业生人数': '623', '毕业生人数': '6554'},
                  {'学校': '大连理工大学', '省份': '辽宁省', '城市': '大连市', '本科毕业生人数': '5608', '硕士毕业生人数': '2689', '博士毕业生人数': '273', '毕业生人数': '8570'},
                  {'学校': '电子科技大学', '省份': '四川省', '城市': '成都市', '本科毕业生人数': '4992', '硕士毕业生人数': '3433', '博士毕业生人数': '274', '毕业生人数': '8699'},
                  {'学校': '东北大学', '省份': '辽宁省', '城市': '沈阳市', '本科毕业生人数': '4724', '硕士毕业生人数': '3219', '博士毕业生人数': '344', '毕业生人数': '8287'},
                  {'学校': '东南大学', '省份': '江苏省', '城市': '南京市', '本科毕业生人数': '4101', '硕士毕业生人数': '3801', '博士毕业生人数': '1111', '毕业生人数': '9013'},
                  {'学校': '复旦大学', '省份': '上海市', '城市': '上海市', '本科毕业生人数': '2789', '硕士毕业生人数': '3532', '博士毕业生人数': '1230', '毕业生人数': '7551'},
                  {'学校': '哈尔滨工业大学', '省份': '黑龙江省', '城市': '哈尔滨市', '本科毕业生人数': '3974', '硕士毕业生人数': '3047', '博士毕业生人数': '538', '毕业生人数': '7559'},
                  {'学校': '湖南大学', '省份': '湖南省', '城市': '长沙市', '本科毕业生人数': '4911', '硕士毕业生人数': '3129', '博士毕业生人数': '218', '毕业生人数': '8258'},
                  {'学校': '华东师范大学', '省份': '上海市', '城市': '上海市', '本科毕业生人数': '3345', '硕士毕业生人数': '2904', '博士毕业生人数': '495', '毕业生人数': '6744'},
                  {'学校': '华南理工大学', '省份': '广东省', '城市': '广州市', '本科毕业生人数': '6223', '硕士毕业生人数': '3462', '博士毕业生人数': '310', '毕业生人数': '9995'},
                  {'学校': '华中科技大学', '省份': '湖北省', '城市': '武汉市', '本科毕业生人数': '7112', '硕士毕业生人数': '5217', '博士毕业生人数': '1140', '毕业生人数': '13469'},
                  {'学校': '吉林大学', '省份': '吉林省', '城市': '长春市', '本科毕业生人数': '10043', '硕士毕业生人数': '5340', '博士毕业生人数': '904', '毕业生人数': '16287'},
                  {'学校': '兰州大学', '省份': '甘肃省', '城市': '兰州市', '本科毕业生人数': '4481', '硕士毕业生人数': '2752', '博士毕业生人数': '319', '毕业生人数': '7552'},
                  {'学校': '南京大学', '省份': '江苏省', '城市': '南京市', '本科毕业生人数': '3060', '硕士毕业生人数': '3813', '博士毕业生人数': '948', '毕业生人数': '7821'},
                  {'学校': '南开大学', '省份': '天津市', '城市': '天津市', '本科毕业生人数': '3252', '硕士毕业生人数': '2982', '博士毕业生人数': '747', '毕业生人数': '6981'},
                  {'学校': '清华大学', '省份': '北京市', '城市': '北京市', '本科毕业生人数': '3119', '硕士毕业生人数': '2554', '博士毕业生人数': '1385', '毕业生人数': '7058'},
                  {'学校': '厦门大学', '省份': '福建省', '城市': '厦门市', '本科毕业生人数': '4504', '硕士毕业生人数': '2727', '博士毕业生人数': '210', '毕业生人数': '7441'},
                  {'学校': '山东大学', '省份': '山东省', '城市': '济南市', '本科毕业生人数': '6697', '硕士毕业生人数': '4045', '博士毕业生人数': '598', '毕业生人数': '11340'},
                  {'学校': '上海交通大学', '省份': '上海市', '城市': '上海市', '本科毕业生人数': '3600', '硕士毕业生人数': '3730', '博士毕业生人数': '1265', '毕业生人数': '8595'},
                  {'学校': '四川大学', '省份': '四川省', '城市': '成都市', '本科毕业生人数': '8836', '硕士毕业生人数': '5081', '博士毕业生人数': '1138', '毕业生人数': '15055'},
                  {'学校': '天津大学', '省份': '天津市', '城市': '天津市', '本科毕业生人数': '3945', '硕士毕业生人数': '3444', '博士毕业生人数': '542', '毕业生人数': '7931'},
                  {'学校': '同济大学', '省份': '上海市', '城市': '上海市', '本科毕业生人数': '3995', '硕士毕业生人数': '3492', '博士毕业生人数': '648', '毕业生人数': '8135'},
                  {'学校': '武汉大学', '省份': '湖北省', '城市': '武汉市', '本科毕业生人数': '6850', '硕士毕业生人数': '4992', '博士毕业生人数': '1033', '毕业生人数': '12875'},
                  {'学校': '西安交通大学', '省份': '陕西省', '城市': '西安市', '本科毕业生人数': '3607', '硕士毕业生人数': '2960', '博士毕业生人数': '729', '毕业生人数': '7296'},
                  {'学校': '西北工业大学', '省份': '陕西省', '城市': '西安市', '本科毕业生人数': '3585', '硕士毕业生人数': '2445', '博士毕业生人数': '369', '毕业生人数': '6399'},
                  {'学校': '浙江大学', '省份': '浙江省', '城市': '杭州市', '本科毕业生人数': '5493', '硕士毕业生人数': '4360', '博士毕业生人数': '1575', '毕业生人数': '11428'},
                  {'学校': '中国海洋大学', '省份': '山东省', '城市': '青岛市', '本科毕业生人数': '3716', '硕士毕业生人数': '2155', '博士毕业生人数': '271', '毕业生人数': '6142'},
                  {'学校': '中国科学技术大学', '省份': '安徽省', '城市': '合肥市', '本科毕业生人数': '1806', '硕士毕业生人数': '2835', '博士毕业生人数': '894', '毕业生人数': '5535'},
                  {'学校': '中国农业大学', '省份': '北京市', '城市': '北京市', '本科毕业生人数': '2742', '硕士毕业生人数': '1716', '博士毕业生人数': '692', '毕业生人数': '5150'},
                  {'学校': '中国人民大学', '省份': '北京市', '城市': '北京市', '本科毕业生人数': '3045', '硕士毕业生人数': '3400', '博士毕业生人数': '758', '毕业生人数': '7203'},
                  {'学校': '中南大学', '省份': '湖南省', '城市': '长沙市', '本科毕业生人数': '7916', '硕士毕业生人数': '4375', '博士毕业生人数': '971', '毕业生人数': '13262'},
                  {'学校': '中山大学', '省份': '广东省', '城市': '广州市', '本科毕业生人数': '6910', '硕士毕业生人数': '3666', '博士毕业生人数': '938', '毕业生人数': '11514'},
                  {'学校': '重庆大学', '省份': '重庆市', '城市': '重庆市', '本科毕业生人数': '6758', '硕士毕业生人数': '3741', '博士毕业生人数': '455', '毕业生人数': '10954'},
                  {'学校': '西北农林科技大学', '省份': '陕西省', '城市': '咸阳市', '本科毕业生人数': '5364', '硕士毕业生人数': '1941', '博士毕业生人数': '293', '毕业生人数': '7598'},
                  {'学校': '中央民族大学', '省份': '北京市', '城市': '北京市', '本科毕业生人数': '2799', '硕士毕业生人数': '1229', '博士毕业生人数': '165', '毕业生人数': '4193'},

                ]
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
