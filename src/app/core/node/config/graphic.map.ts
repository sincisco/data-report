import {BarChartGraphic} from '@core/node/graphic/chart.graphic/bar.chart.graphic';
import {LineChartGraphic} from '@core/node/graphic/chart.graphic/line.chart.graphic';
import {PieChartGraphic} from '@core/node/graphic/chart.graphic/pie.chart.graphic';
import {LinesChartGraphic} from '@core/node/graphic/chart.graphic/lines.chart.graphic';
import {ImageGraphic} from '@core/node/graphic/auxiliary.graphic/image.graphic';
import {TextGraphic} from '@core/node/graphic/auxiliary.graphic/text.graphic';

const map = new Map();
map.set('bar.chart.graphic', BarChartGraphic);
map.set('line.chart.graphic', LineChartGraphic);
map.set('pie.chart.graphic', PieChartGraphic);
map.set('lines.chart.graphic', LinesChartGraphic);
map.set('image.graphic', ImageGraphic);
map.set('text.graphic', TextGraphic);
export const graphicMap = map;
