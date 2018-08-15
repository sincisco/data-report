import {ContainerAlterable} from '@core/node/container/container.alterable.interface';
// import {FaceEchart} from '@core/node/face/echart.face';

const CAROUSEL_ROTATE_TEMPLATE = `
<div class="chart-container">
    <div class="chart-settings-mask"></div>
    <div class="chart-settings-panel">
        <div class="face face-carousel face-item"></div>
        <div class="face face-carousel face-item"></div>
        <div class="face face-carousel face-item"></div>
    </div>
    <div class="carousel">
    </div>
</div>
`;
const transformProp = 'transform';

export class CarouselRotate extends ContainerAlterable {
  private _$carousel: JQuery;
  private _carousel: HTMLElement;

  constructor(parent: HTMLElement) {
    super(CAROUSEL_ROTATE_TEMPLATE);
    parent.appendChild(this._$element[0]);

    this._$carousel = this._$element.find('.carousel');
    this._carousel = this._$carousel[0];

    this._init();

  }

  private _init() {
    this._isInited = true;

    this._rotation = 0;

    // for each slide
    this._$element.find('.chart-settings-panel .face-item').each((index, element) => {
      this._$carousel.append('<figure></figure>');
    });

    this.modify();
  }

  private _interval = 5000;
  private _intervalHandle;

  set start(param: boolean) {
    if (param === this._start)
      return;
    if (param) {
      // automatic slider
      this._intervalHandle = setInterval(() => {
        this.stepBy(1);
      }, this._interval);

      // hide/show controls/btns when hover
      // pause automatic slide when hover
      this._$carousel.hover(
        () => {
          clearInterval(this._intervalHandle);
        },
        () => {
          this._intervalHandle = setInterval(() => {
            this.stepBy(1);
          }, this._interval);
        }
      );
      this._start = true;
    } else {
      this._$carousel.off('mouseenter mouseleave');
      clearInterval(this._intervalHandle);
      this._start = false;
    }
  }


  appendItem() {
    this._$carousel.append('<figure></figure>');
    this.modify();
  }

  deleteItem(index) {
    // 1、清空figure内部的图表  2、删除figure  3、重新计算交互尺寸
    console.log(index);
    var face = this.getFace(index + 1);
    face.destroy();
    this.removeFace(index + 1);
    this._$carousel.find('figure').eq(index).remove();
    this.modify();
  }

  get minFaceNumber() {
    return 3;
  }

  get maxFaceNumber() {
    return 8;
  }

  public setChart(options: any, index: number) {
    if (!this.getFace(index)) {
      // this.setFace(index, new FaceEchart(this._$carousel.find('figure').eq(index - 1)[0], options));
    }
    this.getFace(index).select();
  }

  public resize() {
    this._faceArray.forEach((value) => {
      if (value) {
        value.resize();
      }
    });
  }

  public destroy() {
    this._faceArray.forEach((value) => {
      if (value) {
        value.destroy();
      }
    });
  }

  public render() {
    var figures = '';
    this._$carousel.find('figure').each((index, element) => {
      figures += `
            <figure>${this.getFace(index + 1) ? this.getFace(index + 1).render() : ''}</figure>
            `;
    });
    return `
        <carousel-container>${figures}</carousel-container>
        `;
  }

  private _backfaceInvisible = true;

  set backfaceInvisible(param: boolean) {
    this._backfaceInvisible = param;
    if (param) {
      this._$carousel.addClass('backface-invisible');
    } else {
      this._$carousel.removeClass('backface-invisible');
    }
  }

  private _isHorizontal: boolean = true;

  set setHorizontal(param: boolean) {
    if (this._isHorizontal !== param) {
      this._isHorizontal = param;
      this.modify();
    }
  }

  get isHorizontal(): boolean {
    return this._isHorizontal;
  }

  /*  set panelCount(param: number) {
        if (param !== this._panelCount) {
            this._panelCount = param;
            this.modify();
        }
    }*/

  get panelCount() {
    return this._$carousel.find('figure').length;
  }

  transformProp = 'transform';
  private _rotation = 0;

  private _isInited = false;

  private get _panelSizePx(): number {
    console.log(this._carousel.offsetWidth);
    return this._carousel[this.isHorizontal ? 'offsetWidth' : 'offsetHeight'];
  }

  private get rotateFn(): string {
    return this.isHorizontal ? 'rotateY' : 'rotateX';
  }

  private get theta(): number {
    return this.panelCount ? 360 / this.panelCount : 0;
  }

  /**
   * do some trig to figure out how big the carousel is in 3D space
   * @returns {number}
   */
  private get radius(): number {
    return Math.round((this._panelSizePx / 2) / Math.tan(Math.PI / this.panelCount));
  }


  modify() {
    if (!this._isInited)
      return;

    let panel, angle, i;

    for (i = 0; i < this.panelCount; i++) {
      panel = this._carousel.children[i];
      angle = this.theta * i;
      panel.style.opacity = 1;
      panel.style.display = 'block';
      // panel.style.backgroundColor = 'hsla(' + angle + ', 100%, 50%, 0.8)';
      // rotate panel, then push it out in 3D space
      console.log(this.rotateFn + '(' + angle + 'deg) translateZ(' + this.radius + 'px)');
      panel.style[transformProp] = this.rotateFn + '(' + angle + 'deg) translateZ(' + this.radius + 'px)';
    }

    // hide other panels
    /*for (; i < this._totalPanelCount; i++) {
        panel = this._carousel.children[i];
        panel.style.opacity = 0;
        panel.style.display = 'none';
        panel.style[transformProp] = 'none';
    }*/

    // adjust rotation so panels are always flat
    this._rotation = Math.round(this._rotation / this.theta) * this.theta;

    this.transform();

  }

  stepBy(increment: number) {
    this._rotation += (this.theta * increment * -1);
    this.transform();
  }

  stepTo(panelNo: number) {
    if (panelNo < 0 || panelNo >= this.panelCount) {
      panelNo = 0;
    }
    this._rotation = (this.theta * panelNo);
    this.transform();
  }

  transform() {
    // push the carousel back in 3D space,
    // and rotate it
    console.log('translateZ(-' + this.radius + 'px) ' + this.rotateFn + '(' + this._rotation + 'deg)');
    this._carousel.style[transformProp] = 'translateZ(-' + this.radius + 'px) ' + this.rotateFn + '(' + this._rotation + 'deg)';
  }
}
