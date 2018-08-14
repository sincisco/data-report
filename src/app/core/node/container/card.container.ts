import {Face} from '@core/node/face/face';
import {ContainerImmutable} from '@core/node/container/container.immutable.interface';
import {FaceEchart} from '@core/node/face/echart.face';

const CARD_TEMPLATE = `
<div class="chart-container">
    <div class="chart-settings-mask">
      <div class="m-graphic-toolbar">
          <ul class="more">
            <li><i class="u-icn u-icn-toolbar-more" style="color: rgb(51, 51, 51);"></i></li>
          </ul>
      </div>
    </div>
    <div class="card">
        <figure class="front"></figure>
        <figure class="back"></figure>
    </div>
</div>
`;

export class Card extends ContainerImmutable {
  private _$card: JQuery;
  private readonly _$front: JQuery;
  private readonly _$back: JQuery;

  private _frontFace: Face;
  private _backFace: Face;

  private _interval = 8000;
  private _intervalHandle;

  constructor() {
    super(CARD_TEMPLATE);
    const $element = this._$element,
      $card = this._$card = $element.find('.card');
    this._$front = $card.find('.front');
    this._$back = $card.find('.back');

    this._init();
  }

  private _init() {
    this._$card.on('click', (event) => {
      this._$card.toggleClass('flipped');
    });
  }


  set start(param: boolean) {
    if (param === this._start) {
      return;
    }
    if (param) {
      // automatic slider
      this._intervalHandle = setInterval(() => {
        this._$card.toggleClass('flipped');
      }, this._interval);

      // hide/show controls/btns when hover
      // pause automatic slide when hover
      this._$card.hover(
        () => {
          clearInterval(this._intervalHandle);
        },
        () => {
          this._intervalHandle = setInterval(() => {
            this._$card.toggleClass('flipped');
          }, this._interval);
        }
      );
      this._start = true;
    } else {
      this._$card.off('mouseenter mouseleave');
      clearInterval(this._intervalHandle);
      this._start = false;
    }
  }


  set effect(value: boolean) {
    if (value === true) {
      this._$card.addClass('effect');
    } else {
      this._$card.removeClass('effect');
    }
  }

  public setChart(options: any, index: number) {
    if (index === 1) {
      if (!this._frontFace) {
        this._frontFace = new FaceEchart(this._$front[0], options);
        this._$front.removeClass('no-chart');
      }
      this._$card.removeClass('flipped');
      this._frontFace.select();
    } else {
      if (!this._backFace) {
        this._backFace = new FaceEchart(this._$back[0], options);
        this._$back.removeClass('no-chart');
      }
      this._$card.addClass('flipped');
      this._backFace.select();
    }
  }


  public resize() {
    this._frontFace && this._frontFace.resize();
    this._backFace && this._backFace.resize();
  }

  public destroy() {
    this._frontFace && this._frontFace.destroy();
    this._backFace && this._backFace.destroy();
  }

  public render() {
    return `
            <card-flip>
                <div style="width:100%;height:100%;" front>
                    ${this._frontFace ? this._frontFace.render() : ''}
                </div>
                <div style="width:100%;height:100%;" back>
                    ${this._backFace ? this._backFace.render() : ''}
                </div>
            </card-flip>
        `;
  }


  public get data() {
    return [
      {
        displayName: '切换到正面',
        callback: () => {
          console.log('切换到正面');
        }
      }
    ];
  }
}

