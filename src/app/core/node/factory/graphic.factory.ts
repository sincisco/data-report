import {ReportPageInner} from '@core/node/page/report/page.inner';
import {regionMap} from '@core/node/config/region.map';
import {session} from '@core/node/utils/session';
import {RegionController} from '@core/node/region/region.controller';
import {GraphicWrapper} from '@core/node/graphic/graphic.wrapper';
import {GraphicCreateAction} from '@core/node/operate/graphic.create.action';
import {ReportPageOuter} from '@core/node/page/report/page.outer';

class GraphicFactory {
  /**
   *
   * @param {string} graphicName
   * @param {ReportPageInner} page
   * @param {number} x
   * @param {number} y
   * @param configOption  创建图片的时候，会从外部传入图片信息
   * @returns {{region: RegionController; graphic: GraphicWrapper}}
   */
  newGraphicByName(graphicName: string, page: ReportPageOuter, x: number, y: number, configOption?: any) {
    page.actionManager.execute(new GraphicCreateAction(graphicName, page.reportPage, x, y, configOption));
  }

  createByName(name: string, page: ReportPageOuter, x: number, y: number) {
    return this.newGraphicByName(name, page, x, y);
  }

  paste(graphicMeta: any, x?: number, y?: number) {
    if (regionMap.has(graphicMeta.region.regionKey)) {
      const region: RegionController = new (regionMap.get(graphicMeta.region.regionKey))(session.currentPage.reportPage);

      region.init(graphicMeta.region.regionOption);

      if (Number.isInteger(x) && Number.isInteger(y)) {
        region.setCoordinates(x, y);
      }

      const graphic = new GraphicWrapper(region);
      graphic.init(graphicMeta.graphic);

      setTimeout(() => {
        graphic.resize();
      }, 200);

    }
  }
}

export const graphicFactory = new GraphicFactory();
