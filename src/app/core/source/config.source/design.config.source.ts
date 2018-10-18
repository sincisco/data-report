import * as _ from 'lodash';
import {Subject} from 'rxjs';
import {ChangeItem, GraphicConfig} from './graphic.config';


export class DesignGraphicConfig extends GraphicConfig {
  option: any;

  exportOption() {
    return _.cloneDeep(this.option);
  }

  importOption(option) {
    this._subject = new Subject<any>();
    if (option) {
      this.option = option;
    }
  }

  protected _update(changeItemArray: Array<ChangeItem>) {
    changeItemArray.forEach((value, index, array) => {
      this._trigger(value);
    });
  }
}
