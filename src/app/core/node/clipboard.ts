class Clipboard {
  private _data: any;

  constructor() {
  }

  hasData() {
    return !!this._data;
  }

  saveData(param: any) {
    this._data = param;
  }

  getData() {
    return this._data;
  }
}

export const clipboard = new Clipboard();
