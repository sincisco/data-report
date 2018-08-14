import {Type} from '@angular/core/src/type';
import {IGraphic} from '../graphic/graphic';
import {Region} from '../region/region';

function ChartbarFactory() {

}

export abstract class Factory {
  private _contentClass: Type<IContent>;
  private _graphicClass: Type<IGraphic>;

  create(region: Region) {
    const _graphic = new this._graphicClass(region);

    _graphic.init(this._contentClass);

    return _graphic;
  }
}
