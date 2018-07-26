export interface IFilterConfig {
  name: string;
  config: any;
}

export abstract class BaseFilter {
  constructor(config: any) {
  }

  abstract execute(table: Array<{ [key: string]: any }>) ;
}
