export class MaskHelper {
  private _$maskLeft: JQuery;
  private _$maskRight: JQuery;
  private _$maskTop: JQuery;
  private _$maskBottom: JQuery;

  constructor(private _$mask: JQuery) {
    this._$maskLeft = _$mask.find('.mask-left');
    this._$maskRight = _$mask.find('.mask-right');
    this._$maskTop = _$mask.find('.mask-top');
    this._$maskBottom = _$mask.find('.mask-bottom');
  }


  public repaint($activateElement: JQuery) {
    const left = $activateElement.position().left,
      top = $activateElement.position().top,
      width = $activateElement.outerWidth(),
      height = $activateElement.outerHeight();
    this._$maskLeft
      .width(Math.max(0, left));
    this._$maskRight
      .css({
        left: left + width
      });
    this._$maskBottom
      .width(width)
      .css({
        left: Math.max(0, left),
        top: top + height
      });
    this._$maskTop
      .width(width)
      .height(Math.max(top, 0))
      .css({
        left: Math.max(0, left)
      });
  }
}
