class GlobalSession {
  private _activatedFace: Face;
  private _$tabContent: JQuery;

  constructor() {
  }

  set activated(value: Face) {
    this._activatedFace = value;
  }

  get activated() {
    return this._activatedFace;
  }

  get $formContainer() {
    return this._$tabContent;
  }

}

export const globalSession = new GlobalSession();

export abstract class Face {
  abstract select();

  abstract resize();

  abstract refresh(param1?: boolean);

  abstract render(): string;

  abstract destroy();
}









