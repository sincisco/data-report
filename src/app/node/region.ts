import {INode} from './interface';
import {Report} from "./report";

export const reportGlobal: {
  instance: IContent
} = {
  instance: null
};


export abstract class Region implements INode {
  report: Report;
  template: string;
  $element: JQuery;

  constructor() {

  }

  abstract unselect();


}

