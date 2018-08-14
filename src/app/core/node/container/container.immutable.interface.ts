import {Container} from '@core/node/container/container.interface';

export abstract class ContainerImmutable extends Container {
  protected constructor(template: string) {
    super(template);
    this.init1();
  }

  protected init1() {
    const $settingPanel = this._$settingPanel;

    $settingPanel.addClass('immutable').on('click', '.face-item',
      (event) => {
        const $faceItem = $(event.currentTarget);
        this.setChart(option1, parseInt($faceItem.data('key'), 10));
      });
  }
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

