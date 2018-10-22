import {ReportPage} from '@core/node/page/report/page';
import {regionMap} from '@core/node/config/region.map';
import {session} from '@core/node/utils/session';
import {RegionController} from '@core/node/region/region.controller';
import {GraphicWrapper} from '@core/node/graphic/graphic.wrapper';
import {GraphicMeta, graphicMetaMap} from '@core/node/config/default.graphic.meta.map';

class GraphicFactory {
  /**
   *
   * @param {string} graphicName
   * @param {ReportPage} page
   * @param {number} x
   * @param {number} y
   * @param option  创建图片的时候，会从外部传入图片信息
   * @returns {{region: RegionController; graphic: GraphicWrapper}}
   */
  newGraphicByName(graphicName: string, page: ReportPage, x: number, y: number, option?: any) {
    if (graphicMetaMap[graphicName]) {
      const meta: GraphicMeta = graphicMetaMap[graphicName];
      if (regionMap.has(meta.region.regionKey)) {
        const region: RegionController = new (regionMap.get(meta.region.regionKey))(page);
        region.setCoordinates(x, y);
        if (meta.regionOption) {
          const {width, height} = meta.regionOption;
          region.setDimensions(width, height);
        }

        // const graphic = new meta.graphic(region);
        // graphic.init(option);

        const graphic = new GraphicWrapper(region);
        if (option) {
          graphic.init(Object.assign({}, meta.graphic, {configOption: option}));
        } else {
          graphic.init(meta.graphic);
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
