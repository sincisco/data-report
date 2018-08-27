const TEMPLATE = `<div style="background-color: rgba(5,157,255,0.31);
position:absolute;border:2px rgba(5,127,217,0.81) dashed;z-index: 999;background-clip: content-box;
left:300px;top:300px;display: none;"></div>`;

class RegionSelectHelper {
  private static _instance: RegionSelectHelper;

  private readonly _$element: JQuery;

  private constructor() {
    this._$element = $(TEMPLATE);
  }

  static getInstance() {
    if (!RegionSelectHelper._instance) {
      RegionSelectHelper._instance = new RegionSelectHelper();
    }
    return RegionSelectHelper._instance;
  }

  start(left: number, top: number) {
    $('body').append(this._$element);
    this._$element.css({left, top, width: 0, height: 0}).show();
  }

  show(left: number, top: number, width: number, height: number) {
    this._$element.css({left, top, width, height});
  }

  hide() {
    this._$element.hide();
  }
}

export const regionSelectHelper = RegionSelectHelper.getInstance();
