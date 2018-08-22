import {Type} from '@angular/core';
import {ConfigModel} from '../../../../layout/sider/graphic.config/graphic.config';


export abstract class Auxiliary implements IContent {
  configClass: Type<ConfigModel>;

  abstract resize();

  abstract init(option: any);

  abstract update(option: any);

  updateTheme() {
  };

  refresh() {
  }

  abstract activate();

  deactivate() {
  }

  render() {
  }

  derender() {
  }

  abstract destroy();

  getOption() {

  }
}
