import {IGraphic} from '@core/node/graphic/graphic';
import {FaceWrapper} from '@core/node/face/face.wrapper';
import * as _ from 'lodash';

export class ConfigModel {
  option: any;
  graphic: IGraphic;
  face: FaceWrapper;

  readOption() {
    return _.cloneDeep(this.option);
  }

  writeOption(option) {
    this.option = option;
  }
}
