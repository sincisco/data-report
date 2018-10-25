import {RegionView} from '../region.view';
import {RegionModel, RegionState} from '../region.model';
import {RegionController} from '../region.controller';

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

  constructor(protected _controller: RegionController, protected _model: RegionModel) {
    super();

    this.$element = $(template);
    this.$fill = this.$element.find('.g-fill');
    this._$mover = this.$element.find('.u-mover');

    // 监听model变化
    this._listenToModel(_model);
    this._bindEvent();
  }

  private _listenToModel(model: RegionModel) {
    model
      .register('state', (key, oldValue, newValue, option) => {
        if (oldValue !== newValue) {
          switch (oldValue) {
            case RegionState.selected:
              this.$element.removeClass('selected');
              break;
            case RegionState.multiSelected:
              this.$element.removeClass('multi-selected');
              break;
            case RegionState.activated:
              this.$element.removeClass('activated');
          }
          switch (newValue) {
            case RegionState.default:
              this.$element.removeClass('selected multi-selected activated');
              break;
            case RegionState.selected:
              this.$element.addClass('selected');
              break;
            case RegionState.multiSelected:
              this.$element.addClass('multi-selected');
              break;
            case RegionState.activated:
              this.$element.addClass('activated');
              break;
          }
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
    // 激活状态下需要更新辅助元素mask的状态
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
    super.destroy();
  }
}
