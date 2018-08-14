import {Container} from '@core/node/container/container.interface';
import {Face} from '@core/node/face/face';

export abstract class ContainerAlterable extends Container {
  protected _faceArray: Array<Face> = [];

  constructor(template: string) {
    super(template);

    this._init1();
  }

  protected _init1() {
    const $settingPanel = this._$settingPanel;
    $settingPanel
      .addClass('alterable')
      .append('<div class="face face-add fa fa-plus" ></div>');

    this.refreshIndex();

    $settingPanel.on('click', '.face-add', (event) => {
      if (this._$settingPanel.find('.face-item').length < this.maxFaceNumber) {
        $(event.currentTarget).before('<div class="face face-item"></div>');
        this.refreshIndex();
        this.appendItem();
      }
      return false;
    });

    $settingPanel.on('click', '.face-item',
      (event) => {
        const $faceItem = $(event.currentTarget);
        if (event.offsetX > 80 && event.offsetY > 80) {
          // 删除指定图表
          let index = $faceItem.index();
          $faceItem.remove();
          this.refreshIndex();
          this.deleteItem(index);
        } else {
          this.setChart(option1, parseInt($faceItem.data('attr'), 10));
        }
      });
  }

  protected getFace(index: number) {
    return this._faceArray[index];
  }

  protected removeFace(index: number) {
    this._faceArray.splice(index, 1);
  }

  protected setFace(index: number, face: Face) {
    this._faceArray[index] = face;
  }


  protected refreshIndex() {
    this._$settingPanel.find('.face-item').each((index, faceItem: HTMLElement) => {
      faceItem.setAttribute('data-attr', `${++index}`);
    });
  }

  abstract appendItem();

  abstract deleteItem(index: number);

  abstract get minFaceNumber();

  abstract get maxFaceNumber();

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
