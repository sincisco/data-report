import {Type} from '@angular/core';
import {ConfigModel} from '../../../../components/graphic.config/graphic.config';


export abstract class HtmlNode implements IGraphicView {

  abstract resize();

  abstract init(option: any);

  abstract update(option: any);

  updateTheme(theme: string) {

  }

  refresh() {
  }

  abstract activate();

  deactivate() {
  }

  abstract destroy();
}
