export class ImageRuntime {
  $element: JQuery;

  private _image: HTMLImageElement;

  constructor() {
    this.$element = $(`<div class="m-image" style="position: absolute;"></div>`);
  }

  init(option: any) {
    if (!this._image) {
      const image = this._image = document.createElement('img');
      image.alt = 'Image preview...';
      this.$element.append(image);
    }

    this._initHost(option.option.model);
    this._initImage(option.option.graphic.option);

  }

  private _initHost(model: any) {
    const {zIndex, left, top, width, height} = model;
    this.$element.css({
      zIndex, left, top, width, height
    });
  }

  private _initImage(option: any) {
    if (option.image.dataUrl) {
      this._image.src = option.image.dataUrl;
    }
  }

}
