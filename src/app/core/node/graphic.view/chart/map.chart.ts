import * as _ from 'lodash';
import {Title} from './echart.interface/title';
import {Axis} from './echart.interface/axis';
import {Grid} from './echart.interface/grid';
import {ChartGraphic} from '../../graphic/design/chart/chart.graphic';
import {LineSeriesConfig} from './echart.interface/series/line.series';
import {Chart} from '@core/node/graphic.view/chart/chart';
import {LineConfigComponent} from '../../../../components/graphic.config/chart/line.config.component';

export interface ChartLineOption {
  title?: Title;
  dataset?: any;
  grid?: Grid;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<LineSeriesConfig>;
  color?: Array<string>;
}


export class MapChart extends Chart {

  configClass = LineConfigComponent;

  constructor(chartGraphic: ChartGraphic) {
    super(chartGraphic);
  }

  init() {
    console.log('************************');
    super.init(optionMap);
  }

  update() {
    super.update(optionMap);
  }

  derender() {
    return {
      contentClass: 'map.chart',
      option: this._option
    };
  }

  destroy() {
    delete this.configClass;
    super.destroy();
  }

}

function randomData() {
  return Math.round(Math.random() * 500);
}

const mydata = [
  {name: '北京', value: '100'}, {name: '天津', value: randomData()},
  {name: '上海', value: randomData()}, {name: '重庆', value: randomData()},
  {name: '河北', value: randomData()}, {name: '河南', value: randomData()},
  {name: '云南', value: randomData()}, {name: '辽宁', value: randomData()},
  {name: '黑龙江', value: randomData()}, {name: '湖南', value: randomData()},
  {name: '安徽', value: randomData()}, {name: '山东', value: randomData()},
  {name: '新疆', value: randomData()}, {name: '江苏', value: randomData()},
  {name: '浙江', value: randomData()}, {name: '江西', value: randomData()},
  {name: '湖北', value: randomData()}, {name: '广西', value: randomData()},
  {name: '甘肃', value: randomData()}, {name: '山西', value: randomData()},
  {name: '内蒙古', value: randomData()}, {name: '陕西', value: randomData()},
  {name: '吉林', value: randomData()}, {name: '福建', value: randomData()},
  {name: '贵州', value: randomData()}, {name: '广东', value: randomData()},
  {name: '青海', value: randomData()}, {name: '西藏', value: randomData()},
  {name: '四川', value: randomData()}, {name: '宁夏', value: randomData()},
  {name: '海南', value: randomData()}, {name: '台湾', value: randomData()},
  {name: '香港', value: randomData()}, {name: '澳门', value: randomData()}
];

const optionMap = {
  backgroundColor: 'transparent',
  title: {
    text: '全国地图大数据',
    subtext: '',
    x: 'center'
  },
  tooltip: {
    trigger: 'item'
  },

  // 左侧小导航图标
  visualMap: {
    show: true,
    x: 'left',
    y: 'center',
    splitList: [
      {start: 500, end: 600}, {start: 400, end: 500},
      {start: 300, end: 400}, {start: 200, end: 300},
      {start: 100, end: 200}, {start: 0, end: 100},
    ],
    color: ['#5475f5', '#9feaa5', '#85daef', '#74e2ca', '#e6ac53', '#9fb5ea']
  },

  // 配置属性
  series: [{
    name: '数据',
    type: 'map',
    mapType: 'china',
    roam: true,
    label: {
      normal: {
        show: true  // 省份名称
      },
      emphasis: {
        show: false
      }
    },
    data: mydata  // 数据
  }]
};
