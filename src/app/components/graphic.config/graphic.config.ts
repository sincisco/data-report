import {IGraphic} from '../../core/node/graphic/graphic';
import {FaceWrapper} from '../../core/node/face/face.wrapper';
import * as _ from 'lodash';
import {ChangeItem, ModelEventTarget} from '@core/node/event/model.event';

export class GraphicConfig extends ModelEventTarget {
  option: any;
  graphic: IGraphic;
  face: FaceWrapper;

  exportOption() {
    return _.cloneDeep(this.option);
  }

  importOption(option) {
    this.option = option;
  }

  protected _update(changeItemArray: Array<ChangeItem>) {
    changeItemArray.forEach((value, index, array) => {
      this.trigger(value);
    });
  }
}
