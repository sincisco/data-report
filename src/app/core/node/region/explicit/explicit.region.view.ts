import {RegionView} from '../region.view';
import {IRegionModel, RegionModel, RegionState} from '../region.model';
import {RegionController} from '../region.controller';
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

  constructor(protected _controller: RegionController, protected _model: IRegionModel) {
    super();

    this.$element = $(template);
    this.$fill = this.$element.find('.g-fill');
    this._$mover = this.$element.find('.u-mover');

    // 监听model变化
    this._listenToModel(_model);
    this.refresh();
    this._bindEvent();
  }

  private _initContextMenu() {
    this.addContextMenu([
      {
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

          return false;
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
    ]);
  }

  private _listenToModel(model: IRegionModel) {
    model
      .register('state', (key, oldValue, newValue, option) => {
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
            this.$element.removeClass('selected multi-selected');
            break;
          case RegionState.selected:
            this.$element.addClass('selected');
            break;
          case RegionState.multiSelected:
            this.$element.addClass('multi-selected');
            break;
        }
      })
      .register('left top width height', (key, oldValue, newValue, option) => {
        this.refresh();
      });
  }

  /**
   * 哪些情况下要进行视图刷新 将位置和维度更新到页面上
   *
   * 1、组件刚创建完成的时候
   */
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

  destroy() {
    this.$element.remove();
  }
}
