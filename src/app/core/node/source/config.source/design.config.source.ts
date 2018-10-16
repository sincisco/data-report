import * as _ from 'lodash';
import {ChangeItem, GraphicConfig} from '@core/node/source/config.source/config.source';
import {BehaviorSubject} from 'rxjs';

export class DesignGraphicConfig extends GraphicConfig {
  option: any;

  exportOption() {
    return _.cloneDeep(this.option);
  }

  importOption(option) {
    this._subject = new BehaviorSubject(option);
    this.option = option;
  }

  protected _update(changeItemArray: Array<ChangeItem>) {
    changeItemArray.forEach((value, index, array) => {
      this._trigger(value);
    });
  }
}
