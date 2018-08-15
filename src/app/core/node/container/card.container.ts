import {ContainerImmutable} from '@core/node/container/container.immutable.interface';
import {FaceWrapper} from '@core/node/face/face.wrapper';

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

  private _interval = 8000;
  private _intervalHandle;

  constructor() {
    super(CARD_TEMPLATE);
    const $card = this._$card = this.$element.find('.card');
    this._$front = $card.find('.front');
    this._$back = $card.find('.back');

    this._init();
  }

  private _init() {
    this._$card.on('click', (event) => {
      this._$card.toggleClass('flipped');
    });
    this._map.set('front', this._current = new FaceWrapper(this._$front[0]));
    this._map.set('back', new FaceWrapper(this._$back[0]));
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

  public switchTo(index: number) {
    if (index === 1) {
      this._current = this._map.get('front');
      this._$card.removeClass('flipped');
    } else {
      this._current = this._map.get('back');
      this._$card.addClass('flipped');
    }
    this._current.activate();
  }


  public resize() {
    this._map.forEach((value, key, map) => {
      value.resize();
    });
  }

  public destroy() {
    this._map.forEach((value, key, map) => {
      value.destroy();
    });
  }

  public render() {
    // return `
    //         <card-flip>
    //             <div style="width:100%;height:100%;" front>
    //                 ${this._frontFace ? this._frontFace.render() : ''}
    //             </div>
    //             <div style="width:100%;height:100%;" back>
    //                 ${this._backFace ? this._backFace.render() : ''}
    //             </div>
    //         </card-flip>
    //     `;
  }


  public get data() {
    return [
      {
        displayName: '切换到正面',
        callback: () => {
          this.switchTo(1);
          console.log('切换到正面');
        }
      },
      {
        displayName: '切换到反面',
        callback: () => {
          this.switchTo(2);
          console.log('切换到正面');
        }
      }
    ];
  }
}

