import {regionMap} from '@core/node/config/region.map';
import {RegionController} from '@core/node/region/region.controller';
import {graphicMetaMap} from '@core/node/config/default.graphic.meta.map';
import {GraphicWrapper} from '@core/node/graphic/graphic.wrapper';
import {ReportPage} from '@core/node/page/report/page';
import {IAction} from '@core/node/operate/action';

export class GraphicCreateAction implements IAction {

  private _region: RegionController;

  constructor(private _graphicName: string, private _page: ReportPage,
              private _x: number, private _y: number, private _configOption?: any) {

  }

  forward() {
    // 是否存在图表的默认定义
    if (graphicMetaMap.has(this._graphicName)) {
      const graphicMeta = graphicMetaMap.get(this._graphicName);

      if (regionMap.has(graphicMeta.region.regionKey)) {
        const region: RegionController = new (regionMap.get(graphicMeta.region.regionKey))(this._page);
        region.setCoordinates(this._x, this._y);
        if (graphicMeta.region.regionOption) {
          const {width, height} = graphicMeta.region.regionOption;
          region.setDimensions(width, height);
        }

        const graphicWrapper = new GraphicWrapper(region);
        if (this._configOption) {
          graphicWrapper.init(Object.assign({}, graphicMeta.graphic, {configOption: this._configOption}));
        } else {
          graphicWrapper.init(graphicMeta.graphic);
        }


        setTimeout(() => {
          graphicWrapper.resize();
        }, 200);

        this._region = region;

        return {
          region, graphicWrapper
        };
      }
    }
  }

  backward() {
    if (this._region) {
      this._region.destroy();
      this._region = null;
    }
  }
}
