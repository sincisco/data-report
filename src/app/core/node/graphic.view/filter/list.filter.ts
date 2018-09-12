import * as _ from 'lodash';
import {FilterNode} from './filter';

interface HeaderOption {
  tag?: string;
  text?: string;
  backgroundColor?: string;
}

const HeaderOptionDefault: HeaderOption = {
  tag: '<h1></h1>',
  text: '标题1',
  backgroundColor: 'transparent'
};


export class ListFilter extends FilterNode {
  private _option: HeaderOption;
  private _$host: JQuery;
  private _$element: JQuery;

  constructor(private _host: HTMLElement) {
    super();

  }

  init(option: HeaderOption) {
    this._option = _.defaultsDeep(option, HeaderOptionDefault);
    this._refresh();
  }

  resize() {

  }

  update(option: any) {

  }

  private _refresh() {

  }

  activate() {

  }

  destroy() {
  }
}
