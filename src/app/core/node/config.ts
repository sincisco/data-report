import {Type} from '@angular/core/src/type';
import {RegionController} from '@core/node/region/region.controller';
import {IGraphic} from '@core/node/graphic/graphic';
import {IGraphicView} from '@core/node/graphic.view/graphic.view';

interface GraphicItem {
  regionClass: Type<RegionController>;
  graphicClass: Type<IGraphic>;
  contentClass: Type<IGraphicView>;
}
