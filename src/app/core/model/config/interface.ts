import {Type} from '@angular/core';
import {DesignGraphicConfig} from '@core/node/source/config.source/design.config.source';


export interface IConfigOption {
  graphicId: string;
  graphicConfigClass: Type<DesignGraphicConfig>;
  option: any;
}
