import {RegionController} from '../../region/region.controller';
import {Chart} from '../../graphic.view/chart/chart';
import * as _ from 'lodash';
import {Observable, Subscription} from 'rxjs';
import {DefaultGraphic} from '@core/node/graphic/default.graphic';

const template = `
<div class="flip-number-wrapper" style="justify-content: center;">
  <div class="flip-number" style="flex-direction: row;">
    <div class="flip-number-prefix"
         style="font-family: 'Microsoft Yahei'; font-size: 14px; color: rgb(115, 170, 229); 
         align-self: flex-end; margin-right: 0px; margin-bottom: 0px;"></div>
    <div class="flip-number-number" style="align-self: right;">
      <div class="flip-single-number">
        1
      </div>
      <div class="flip-single-number">
        0
      </div>
      <div class="flip-single-number">
        ,
      </div>
      <div class="flip-single-number">
        0
      </div>
      <div class="flip-single-number">
        0
      </div>
      <div class="flip-single-number">
        1
      </div>
      <div class="flip-single-number">
        ,
      </div>
      <div class="flip-single-number">
        7
      </div>
      <div class="flip-single-number">
        2
      </div>
      <div class="flip-single-number">
        2
      </div>
    </div>
    <div class="flip-number-suffix"
         style="font-family: 'Microsoft Yahei'; font-size: 20px; color: rgb(115, 170, 229); 
         align-self: flex-end; margin-left: 7px; margin-top: 0px;">
      元
    </div>
  </div>
</div>
`;

export class FlipNumberGraphic extends DefaultGraphic {

  /**
   * 1、初始化视图
   * 2、给视图绑定事件处理函数
   * 3、建立父子关系
   * @param {RegionController} region
   */
  constructor(region: RegionController) {
    super();
    this.$element = $(template);
  }

  init(option?: any) {
    this._modelEventTarget.register('option', (key, oldValue, newValue) => {
      this.update(newValue);
    });
  }

  accept(modelSource: Observable<any>): Subscription {
    console.log('accept invoke', modelSource);

    let lastConfig, lastData;
    return modelSource.subscribe((modelArray: Array<any>) => {
      const [config, data] = modelArray;
      if (config !== lastConfig) {
        this._modelEventTarget.trigger(config);
        lastConfig = config;
      }
      if (data !== lastData) {
        this._generateDom(data);
        lastData = data;
      }
      console.log(config, data);
    });
  }


  private _generateDom(num: Number) {
    const numArray = this._handle(num);
    this.$element.find('.flip-number-number').html(numArray.map((value, index, array) => {
      if (value === ',') {
        return `<div class="flip-single-number only-comma">,</div>`;
      } else {
        return `<div class="flip-single-number only-number">${value}</div>`;
      }
    }).join(' '));
  }

  private _handle(num: Number) {
    console.log(num);
    const numArray = _.toArray(num + '');
    const aa = _.chunk(numArray.reverse(), 3);
    aa.forEach((value, index, array) => {
      if (index < array.length - 1) {
        value.push(',');
      }
    });
    return _.flatten(aa).reverse();
  }


  update(option: any) {

  }

  updateGraphic(option: any) {

  }
}
