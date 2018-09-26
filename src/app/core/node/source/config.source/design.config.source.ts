import * as _ from 'lodash';
import {ChangeItem, ConfigSource} from '@core/node/source/config.source/config.source';

export class DesignConfigSource extends ConfigSource {
  option: any;

  exportOption() {
    return _.cloneDeep(this.option);
  }

  importOption(option) {
    this.option = option;
  }

  protected _update(changeItemArray: Array<ChangeItem>) {
    changeItemArray.forEach((value, index, array) => {
      this._trigger(value);
    });
  }
}
