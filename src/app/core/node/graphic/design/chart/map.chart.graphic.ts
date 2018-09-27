import {Title} from '../../../graphic.view/chart/echart.interface/title';
import {Grid} from '../../../graphic.view/chart/echart.interface/grid';
import {Axis} from '../../../graphic.view/chart/echart.interface/axis';
import {ChartGraphic} from './chart.graphic';
import {RegionController} from '../../../region/region.controller';
import {siderLeftComponent} from '../../../../../layout/sider/sider.left.component';
import {LineSeriesConfig} from '../../../graphic.view/chart/echart.interface/series/line.series';
import {Chart} from '../../../graphic.view/chart/chart';
import {MapConfigComponent} from '../../../../../components/graphic.config/chart/map.config.component';


export interface ChartLineOption {
  title?: Title;
  dataset?: any;
  grid?: Grid;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<LineSeriesConfig>;
  color?: Array<string>;
}

export class MapChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }


  init(option?: any) {
    this._chart = new Chart(this);
    this._configComponentRef = siderLeftComponent.forwardCreateGraphicConfig(MapConfigComponent);
    if (option) {
      this.configSource.importOption(option);
    }
    this.configSource.register('option', (key, oldValue, newValue) => {
      this.update(newValue);
    });
  }

  getOption() {
    return {
      graphicClass: 'map.chart.graphic',
      option: this.configSource.exportOption()
    };
  }

}
