import {C} from '@angular/core/src/render3';

class Clipboard {
  private _data: any;

  constructor() {
  }

  saveData(param: any) {
    this._data = param;
  }

  getData() {
    return this._data;
  }
}

export const clipboard = new Clipboard();
