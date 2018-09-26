export class ChartRuntime {
  $element: JQuery;
  protected _echart: Echart;

  private _theme = 'vintage';
  protected _option: any = {};

  constructor() {
    this.$element = $('<div style="width: 100%;height: 100%;position: absolute;"></div>');
  }

  init(option: any) {
    this._initHost(option.option.model);
    this._initChart(option.option.graphic.option);
  }

  private _initHost(model: any) {
    const {zIndex, left, top, width, height} = model;
    this.$element.css({
      zIndex, left, top, width, height
    });
  }

  private _initChart(option: any) {
    this._echart = echarts.init(this.$element[0], this._theme);
    this._echart.setOption(option);
  }


  resize() {
    if (this._echart) {
      this._echart.resize();
    }
  }

  destroy() {
    if (this._echart && !this._echart.isDisposed()) {
      this._echart.dispose();
      this._echart = null;
    }
    this.$element.empty();
    delete this._option;
  }

}
