import {Type} from '@angular/core/src/type';
import {Region} from '@core/node/region/region';
import {IGraphic} from '@core/node/graphic/graphic';
import {IGraphicView} from '@core/node/graphic.view/graphic.view';

interface GraphicItem {
  regionClass: Type<Region>;
  graphicClass: Type<IGraphic>;
  contentClass: Type<IGraphicView>;
}
