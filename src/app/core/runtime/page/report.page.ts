import {ChartRuntime} from '@core/runtime/graphic/chart/chart';
import {ImageRuntime} from '@core/runtime/graphic/auxiliary/image';

export class ReportPageRuntime {
  $element: JQuery;

  constructor() {
    this.$element = $('<div style="width: 100%;height: 100%;position: relative;"></div>');

    let status = false;
    this.$element[0].addEventListener('click', () => {
      // Use the final API, the polyfill will call the mozRequestFullScreen or webKitRequestFullScreen for you

      if (status) {
        document.exitFullscreen();
        status = false;
      } else {
        this.$element[0].requestFullscreen();
        status = true;
      }
    }, false);
  }

  render(option) {
    this._init(option.option);
    this._initChildren(option.children);
  }

  private _init(option: any) {
    this.$element.css({
      width: option.width,
      height: option.height
    });
    switch (option.backgroundMode) {
      case 'backgroundColor':
        this.$element.css({
          backgroundColor: option.backgroundColor
        });
        break;
      case 'backgroundClass':
        this.$element.addClass(option.backgroundClass);
        break;
      case 'custom':
        option.backgroundCustom.dataUrl && this.$element.css({
          backgroundImage: `url(${option.backgroundCustom.dataUrl})`
        });
        break;
    }

  }

  private _initChildren(children: Array<any>) {
    children.forEach((value, index, array) => {
      switch (value.option.graphic.graphicClass) {
        case 'bar.chart.graphic':
          const chart = new ChartRuntime();
          chart.init(value);
          this.$element.append(chart.$element);
          break;
        case 'image.graphic':
          const image = new ImageRuntime();
          image.init(value);
          this.$element.append(image.$element);
          break;
      }

    });
  }
}
