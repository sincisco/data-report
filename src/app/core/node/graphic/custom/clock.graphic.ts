import * as moment from 'moment';
import {Observable} from 'rxjs';
import {OuterModelEventTarget} from '@core/node/event/model.event';
import {RegionController} from '../../region/region.controller';
import {IGraphic} from '../graphic';
import {Chart} from '../../graphic.view/chart/chart';

const template = `
<div class="time-chart-container" 
style='font-family: "Microsoft Yahei", Arial, sans-serif; 
font-size: 20px; color: rgb(255, 255, 255); font-weight: normal; justify-content: center;'>
<i class="anticon anticon-clock-circle-o" style="padding-right: 12px"></i>
<span>1970-01-01 00:00:00</span></div>
`;

export class ClockGraphic implements IGraphic {
  $element: JQuery;

  private _internal;

  private _modelEventTarget = new OuterModelEventTarget();

  /**
   * 1、初始化视图
   * 2、给视图绑定事件处理函数
   * 3、建立父子关系
   * @param {RegionController} region
   */
  constructor(region: RegionController) {
    this.$element = $(template);
  }

  accept(model: Observable<any>) {
    return null;
  }

  init(option?: any) {
    this._modelEventTarget.register('option', (key, oldValue, newValue) => {
      this.update(newValue);
    });

    this._internal = setInterval(() => {
      this.$element.find('span').text(moment().format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);
  }

  addChild(chart: Chart) {
  }


  update(option: any) {

  }

  updateTheme(theme) {

  }

  resize() {

  }

  activate() {

  }

  deactivate() {

  }

  /**
   *
   */
  destroy() {
    if (this._internal) {
      clearInterval(this._internal);
      this._internal = null;
    }
  }
}
