import {RegionView} from '../region.view';
import {RegionState} from '../region.model';
import {fromEvent, Subscription} from 'rxjs';
import {BarChartGraphic} from '../../graphic/chart/bar.chart.graphic';
import {TextAuxiliary} from '../../graphic.view/auxiliary/text.auxiliary';
import {LinesChartGraphic} from '../../graphic/chart/lines.chart.graphic';
import {LineChartGraphic} from '../../graphic/chart/line.chart.graphic';
import {TextGraphic} from '../../graphic/auxiliary/text.graphic';
import {CoordinatesAndDimensions, Dimensions} from '../../interface';
import {clipboard} from '../../clipboard';
import {filter, throttleTime} from 'rxjs/internal/operators';
import {closestNum} from '../../../../utils/common';
import {PieChartGraphic} from '../../graphic/chart/pie.chart.graphic';
import {resizeTipHelper} from '../../helper/resize.tip.helper';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {RegionController} from '../region.controller';
import {RegionModel} from '@core/node/region/region.model';

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

export class CommentRegionView extends RegionView {

  private _defaultDimensions: Dimensions = {
    width: 30,
    height: 30
  };

  constructor(protected _controller: RegionController, protected _model: RegionModel) {
    super();

    this.$element = $(template);
    this.$fill = this.$element.find('.g-fill');
    this._$mover = this.$element.find('.u-mover');

    this._listenToModel(_model);
    this.refresh();
    this._bindEvent();
  }

  private _initContextMenu() {
    // this.addContextMenu([
    //   {
    //     displayName: '复制',
    //     shortcut: 'Ctrl+C',
    //     callback: () => {
    //       console.log('复制');
    //     }
    //   }, {
    //     displayName: '剪切',
    //     shortcut: 'Ctrl+X'
    //   }, {
    //     displayName: '删除',
    //     shortcut: 'Backspace',
    //     callback: () => {
    //       // if (this._graphic) {
    //       //   this._graphic.destroy();
    //       // }
    //       // this.destroy();
    //       // contextMenuHelper.close();
    //     }
    //   }, 'split', {
    //     displayName: '创建Paragraph',
    //     callback: () => {
    //       // const _graphic = this._graphic = new CommentGraphic(this);
    //       // const option = {
    //       //   text: '英特尔 Xeon(至强)'
    //       // };
    //       //
    //       // // 使用刚指定的配置项和数据显示图表。
    //       // _graphic.init(CommentAuxiliary);
    //       // contextMenuHelper.close();
    //     }
    //   }
    // ]);
  }

  private _listenToModel(model: RegionModel) {
    model.register('state', (key, oldValue, newValue, option) => {
      console.log(key, oldValue, newValue, option);
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
          this.refresh();
          break;
        case RegionState.selected:
          this.$element.addClass('selected');
          this.refresh();
          break;
        case RegionState.multiSelected:
          this.$element.addClass('multi-selected');
          break;
      }
    });
  }

  refresh() {
    if (this._model.state === RegionState.default || this._model.state === RegionState.multiSelected) {
      this.$element.css({
        width: this._defaultDimensions.width,
        height: this._defaultDimensions.height,
        left: this._model.left,
        top: this._model.top
      });
    } else if (this._model.state === RegionState.selected) {
      this.$element.css({
        width: this._model.width,
        height: this._model.height,
        left: this._model.left,
        top: this._model.top
      });
    }
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
