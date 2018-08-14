import {Face} from '@core/node/face/face';

export class FaceEchart extends Face {
  private _echart: Echart;
  private _sourceID = 'no1';

  // private _propertyForm: PropertyForm;

  constructor(dom: Element, options: any) {
    super();
    this._echart = echarts.init(dom);
    this._echart.setOption(options);
  }

  set sourceID(param1) {
    this._sourceID = param1;
  }

  select() {

  }

  refresh(isForce?: boolean) {
    if (isForce === true) {
      this._echart.clear();
    }
    // this._echart.setOption(this._propertyForm.value);
  }

  exeInit(init) {
    this._echart.clear();
    init(this._echart);
  }

  resize() {
    this._echart.resize();
  }

  destroy() {
    if (this._echart) {
      this._echart.dispose();
    }
  }


  render() {
    return `
        <echart-wrapper pid="${this._sourceID || '07ecb2ce-0a77-4759-8b1a-e46ee9360907'}"></echart-wrapper>
        `;
  }
}
