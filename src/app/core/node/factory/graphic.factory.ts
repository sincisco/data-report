import {ExplicitRegion} from '@core/node/region/explicit/explicit.region';
import {ReportPage} from '@core/node/page/report/page';
import {TextGraphic} from '@core/node/graphic/auxiliary.graphic/text.graphic';
import {CommentRegion} from '@core/node/region/comment/comment.region';
import {CommentGraphic} from '@core/node/graphic/auxiliary.graphic/comment.graphic';
import {regionMap} from '@core/node/config/region.map';
import {BarChartGraphic} from '@core/node/graphic/chart.graphic/bar.chart.graphic';
import {graphicMap} from '@core/node/config/graphic.map';
import {session} from '@core/node/utils/session';
import {LineChartGraphic} from '@core/node/graphic/chart.graphic/line.chart.graphic';
import {PieChartGraphic} from '@core/node/graphic/chart.graphic/pie.chart.graphic';
import {ImageGraphic} from '@core/node/graphic/auxiliary.graphic/image.graphic';
import {RegionController} from '@core/node/region/region.controller';
import {ClockGraphic} from '@core/node/graphic/custom.graphic/clock.graphic';


interface GraphicMeta {
  region: any;
  graphic: any;
}

interface GraphicMetaMap {
  [key: string]: GraphicMeta;
}

const newGraphicMeta: GraphicMetaMap = {
  barChart: {
    region: ExplicitRegion,
    graphic: BarChartGraphic
  },
  lineChart: {
    region: ExplicitRegion,
    graphic: LineChartGraphic
  },
  pieChart: {
    region: ExplicitRegion,
    graphic: PieChartGraphic
  },
  textAuxiliary: {
    region: ExplicitRegion,
    graphic: TextGraphic
  },
  commentAuxiliary: {
    region: CommentRegion,
    graphic: CommentGraphic
  },
  imageAuxiliary: {
    region: ExplicitRegion,
    graphic: ImageGraphic
  },
  clock: {
    region: ExplicitRegion,
    graphic: ClockGraphic
  }
};

class GraphicFactory {
  newGraphicByName(graphicName: string, page: ReportPage, x: number, y: number, option?: any) {
    if (newGraphicMeta[graphicName]) {
      const meta: GraphicMeta = newGraphicMeta[graphicName];
      const region: RegionController = new meta.region(page);
      region.setCoordinates(x, y);

      const graphic = new meta.graphic(region);
      graphic.init(option);

      return {
        region, graphic
      };
    }
  }

  createByName(name: string, page: ReportPage, x: number, y: number) {
    return this.newGraphicByName(name, page, x, y);
  }

  paste(option: any, x?: number, y?: number) {
    if (regionMap.has(option.regionClass)) {
      const regionClass = regionMap.get(option.regionClass);
      const region: RegionController = new regionClass(session.currentPage);
      region.render(option.option);
      if (Number.isInteger(x) && Number.isInteger(y)) {
        region.setCoordinates(x, y);
      }
    }
  }
}

export const graphicFactory = new GraphicFactory();
