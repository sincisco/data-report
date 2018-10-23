type MaskRepaint = ($activatedElement: JQuery) => void;

export function repaintMaskGenerator($mask: JQuery): MaskRepaint {
  const
    $maskLeft = $mask.find('.mask-left'),
    $maskRight = $mask.find('.mask-right'),
    $maskTop = $mask.find('.mask-top'),
    $maskBottom = $mask.find('.mask-bottom');

  return ($activatedElement: JQuery) => {
    const left = $activatedElement.position().left,
      top = $activatedElement.position().top,
      width = $activatedElement.outerWidth(),
      height = $activatedElement.outerHeight();
    $maskLeft
      .width(Math.max(0, left));
    $maskRight
      .css({
        left: left + width
      });
    $maskBottom
      .width(width)
      .css({
        left: Math.max(0, left),
        top: top + height
      });
    $maskTop
      .width(width)
      .height(Math.max(top, 0))
      .css({
        left: Math.max(0, left)
      });
  };
}
