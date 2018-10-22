import {ReportPage} from '@core/node/page/report/page';
import {regionMap} from '@core/node/config/region.map';
import {session} from '@core/node/utils/session';
import {RegionController} from '@core/node/region/region.controller';
import {GraphicWrapper} from '@core/node/graphic/graphic.wrapper';
import {graphicMetaMap} from '@core/node/config/default.graphic.meta.map';

class GraphicFactory {
  /**
   *
   * @param {string} graphicName
   * @param {ReportPage} page
   * @param {number} x
   * @param {number} y
   * @param configOption  创建图片的时候，会从外部传入图片信息
   * @returns {{region: RegionController; graphic: GraphicWrapper}}
   */
  newGraphicByName(graphicName: string, page: ReportPage, x: number, y: number, configOption?: any) {
    // 是否存在图表的默认定义
    if (graphicMetaMap.has(graphicName)) {
      const graphicMeta = graphicMetaMap.get(graphicName);
      if (regionMap.has(graphicMeta.region.regionKey)) {
        const region: RegionController = new (regionMap.get(graphicMeta.region.regionKey))(page);
        region.setCoordinates(x, y);
        if (graphicMeta.regionOption) {
          const {width, height} = graphicMeta.regionOption;
          region.setDimensions(width, height);
        }

        // const graphic = new meta.graphic(region);
        // graphic.init(option);

        const graphic = new GraphicWrapper(region);
        if (configOption) {
          graphic.init(Object.assign({}, graphicMeta.graphic, {configOption}));
        } else {
          graphic.init(graphicMeta.graphic);
        }


        setTimeout(() => {
          graphic.resize();
        }, 200);

        return {
          region, graphic
        };
      }
    }
  }

  createByName(name: string, page: ReportPage, x: number, y: number) {
    return this.newGraphicByName(name, page, x, y);
  }

  paste(graphicMeta: any, x?: number, y?: number) {
    if (regionMap.has(graphicMeta.region.regionKey)) {
      const region: RegionController = new (regionMap.get(graphicMeta.region.regionKey))(session.currentPage);
      region.render(graphicMeta.option);

      if (Number.isInteger(x) && Number.isInteger(y)) {
        region.setCoordinates(x, y);
      }
    }
  }
}

export const graphicFactory = new GraphicFactory();
