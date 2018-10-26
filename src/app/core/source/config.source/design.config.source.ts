import * as _ from 'lodash';
import {BehaviorSubject, Subject} from 'rxjs';
import {GraphicConfig} from '../../config/design/graphic.config';
import {ChangedItem} from '@core/node/event/model.event';


export class DesignGraphicConfig extends GraphicConfig {
  option: any;

  exportOption() {
    return _.cloneDeep(this.option);
  }

  importOption(option) {
    this._subject = new BehaviorSubject(null);
    if (option) {
      this.option = option;
    }
  }

  protected _update(changeItemArray: Array<ChangedItem>) {
    changeItemArray.forEach((value, index, array) => {
      this._trigger(value);
    });
  }
}
