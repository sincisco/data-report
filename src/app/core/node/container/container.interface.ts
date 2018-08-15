import {contextMenuHelper} from '../../../utils/contextMenu';
import {FaceWrapper} from '@core/node/face/face.wrapper';
import {BarEchartFace} from '@core/node/face/bar.echart.face';

export abstract class Container {
  protected _$element: JQuery;
  protected _$settingMask: JQuery;
  protected _$settingPanel: JQuery;
  protected _start = false;

  protected _current: FaceWrapper;
  public data;

  constructor(template: string) {
    const $element = this._$element = $(template),
      $settingMask = this._$settingMask = $element.find('.chart-settings-mask'),
      $settingPanel = this._$settingPanel = $element.find('.chart-settings-panel');

    $settingMask.contextmenu(($event) => {
      contextMenuHelper.openWithEvent([{
        displayName: '创建柱状图',
        callback: () => {
          console.log('创建柱状图');
          this._current.create(BarEchartFace);
        }
      }], $event);
      return false;
    });
    /*.append(new GraphicToolbar().$element)*/
    $settingMask.dblclick(() => {
      $element.addClass('editing');
      return false;
    }).click(() => {
      this._current.activate();
    });

    $settingMask.find('li').click(($event) => {
      contextMenuHelper.open(this.data, $event.pageX, $event.pageY, $event);
    });
    // $settingPanel.dblclick(() => {
    //   $element.removeClass('editing');
    //   return false;
    // });
  }

  get $element() {
    return this._$element;
  }

  adjustFaceNum() {

  }

  setChart(options: any, index: number) {

  }

  abstract set start(param: boolean);

  abstract resize();

  abstract render();

  abstract destroy();


}


var option1 = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [820, 932, 901, 934, 1290, 1330, 1320],
    type: 'line',
    smooth: true
  }]
};






