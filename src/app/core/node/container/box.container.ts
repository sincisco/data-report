import {Face} from '@core/node/face/face';
import {ContainerImmutable} from '@core/node/container/container.immutable.interface';
import {EchartFace} from '@core/node/face/echart.face';

const Box_TEMPLATE = `
<div class="chart-container">
    <div class="chart-settings-mask">
    </div>
    <div class="chart-settings-panel">
        <div class="face face-cube face-item" data-attr="front" data-key="1"></div>
        <div class="face face-cube face-item" data-attr="back" data-key="2"></div>
        <div class="face face-cube face-item" data-attr="left" data-key="3"></div>
        <div class="face face-cube face-item" data-attr="right" data-key="4"></div>
        <div class="face face-cube face-item" data-attr="top" data-key="5"></div>
        <div class="face face-cube face-item" data-attr="bottom" data-key="6"></div>
    </div>
    <div class="box show-front">
        <figure class="front"></figure>
        <figure class="back"></figure>
        <figure class="left"></figure>
        <figure class="right"></figure>
        <figure class="top"></figure>
        <figure class="bottom"></figure>
    </div>
</div>
`;

/*&.front {
    transform: rotateY(0deg) translateZ(200px);
}
&.back {
    transform: rotateX(180deg) translateZ(200px);
}
&.right {
    transform: rotateY(90deg) translateZ(200px);
}
&.left {
    transform: rotateY(-90deg) translateZ(200px);
}
&.top {
    transform: rotateX(90deg) translateZ(200px);
}
&.bottom {
    transform: rotateX(-90deg) translateZ(200px);
}*/
export class Box extends ContainerImmutable {
  private _$box: JQuery;
  private _$front: JQuery;
  private _$back: JQuery;
  private _$left: JQuery;
  private _$right: JQuery;
  private _$top: JQuery;
  private _$bottom: JQuery;

  private _effect: string;

  constructor(parent: HTMLElement) {
    super(Box_TEMPLATE);
    parent.appendChild(this._$element[0]);
    const $box = this._$box = this._$element.find('.box');
    this._$front = $box.find('.front');
    this._$back = $box.find('.back');
    this._$left = $box.find('.left');
    this._$right = $box.find('.right');
    this._$top = $box.find('.top');
    this._$bottom = $box.find('.bottom');

    var x = parent.offsetWidth, y = parent.offsetHeight;

    this._compute(x, y);
    this.effect = 'show-front';
    this._init();
  }

  private _compute(x, y) {
    if (x >= y) {
      this._biggerX(x, y);
    } else {
      this._biggerY(x, y);
    }
  }

  private _transformMap;

  private _biggerX(x, y) {
    this._$front.width(x).height(y);
    this._$back.width(x).height(y);

    this._$left.width(y).height(y);
    this._$right.width(y).height(y);

    this._$top.width(x).height(y);
    this._$bottom.width(x).height(y);

    this._$left.css('left', (x - y) / 2);
    this._$right.css('left', (x - y) / 2);

    this._$front.css('transform', `rotateY(0deg) translateZ(${y / 2}px)`);
    this._$back.css('transform', `rotateY(180deg) translateZ(${y / 2}px)`);
    this._$left.css('transform', `rotateY(-90deg) translateZ(${x / 2}px)`);
    this._$right.css('transform', `rotateY(90deg) translateZ(${x / 2}px)`);
    this._$top.css('transform', `rotateX(90deg) translateZ(${y / 2}px)`);
    this._$bottom.css('transform', `rotateX(-90deg) translateZ(${y / 2}px)`);

    /* this._transformMap = {
         'show-front': `translateZ( -${y / 2}px) rotateY(0deg)`,
         'show-back': `translateZ( -${y / 2}px) rotateY(-180deg)`,
         'show-left': `translateZ(-${x / 2}px) rotateY(90deg)`,
         'show-right': `translateZ(-${x / 2}px) rotateY(-90deg)`,
         'show-top': `translateZ(-${y / 2}px) rotateX(-90deg)`,
         'show-bottom': `translateZ(-${y / 2}px) rotateX(90deg)`
     }*/
    this._transformMap = {
      'show-front': `translateZ( -${y / 2}px) rotateY(0deg)`,
      'show-top': `translateZ(-${y / 2}px) rotateX(-90deg)`,
      'show-back': `translateZ( -${y / 2}px) rotateX(-180deg)`,
      'show-bottom': `translateZ(-${y / 2}px) rotateX(-270deg)`,
      'show-left': `translateZ(-${x / 2}px) rotateY(90deg)`,
      'show-right': `translateZ(-${x / 2}px) rotateY(-90deg)`
    };
  }

  private _biggerY(x, y) {
    this._$front.width(x).height(y);
    this._$back.width(x).height(y);

    this._$left.width(x).height(y);
    this._$right.width(x).height(y);

    this._$top.width(x).height(x);
    this._$bottom.width(x).height(x);

    this._$top.css('top', (y - x) / 2);
    this._$bottom.css('top', (y - x) / 2);

    this._$front.css('transform', `rotateY(0deg) translateZ(${x / 2}px)`);
    this._$back.css('transform', `rotateY(180deg) translateZ(${x / 2}px)`);
    this._$left.css('transform', `rotateY(-90deg) translateZ(${x / 2}px)`);
    this._$right.css('transform', `rotateY(90deg) translateZ(${x / 2}px)`);
    this._$top.css('transform', `rotateX(90deg) translateZ(${y / 2}px)`);
    this._$bottom.css('transform', `rotateX(-90deg) translateZ(${y / 2}px)`);

    this._transformMap = {
      'show-front': `translateZ( -${x / 2}px) rotateY(0deg)`,
      'show-back': `translateZ( -${x / 2}px) rotateY(-180deg)`,
      'show-left': `translateZ(-${x / 2}px) rotateY(90deg)`,
      'show-right': `translateZ(-${x / 2}px) rotateY(-90deg)`,
      'show-top': `translateZ(-${y / 2}px) rotateX(-90deg)`,
      'show-bottom': `translateZ(-${y / 2}px) rotateX(90deg)`
    };
  }

  set effect(key: string) {
    this._effect = key;
    this._$box.css('transform', this._transformMap[key]);
  }

  get effect() {
    return this._effect;
  }

  private _frontFace: Face;
  private _backFace: Face;
  private _leftFace: Face;
  private _rightFace: Face;
  private _topFace: Face;
  private _bottomFace: Face;

  public setChart(options: any, index: number) {
    if (index === 1) {
      if (!this._frontFace) {
        //this._frontFace = new EchartFace(this._$front[0]);
      }
      this.effect = 'show-front';
      this._frontFace.select();

    } else if (index === 2) {
      if (!this._backFace) {
        //this._backFace = new EchartFace(this._$back[0]);
      }
      this.effect = 'show-back';
      this._backFace.select();

    } else if (index === 3) {
      if (!this._leftFace) {
        //this._leftFace = new EchartFace(this._$left[0]);
      }
      this.effect = 'show-left';
      this._leftFace.select();
    } else if (index === 4) {
      if (!this._rightFace) {
        // this._rightFace = new EchartFace(this._$right[0]);
      }
      this.effect = 'show-right';
      this._rightFace.select();
    } else if (index === 5) {
      if (!this._topFace) {
        //this._topFace = new EchartFace(this._$top[0]);
      }
      this.effect = 'show-top';
      this._topFace.select();
    } else {
      if (!this._bottomFace) {
        //this._bottomFace = new EchartFace(this._$bottom[0]);
      }
      this.effect = 'show-bottpm';
      this._bottomFace.select();
    }
  }


  private count = 1;

  private _init() {
    this._$box.on('click', (event) => {
      this.effect = this._array[this.count++ % 6];
      return false;
    });
  }

  private _interval = 3000;
  private _intervalHandle;
  private _array = ['show-front', 'show-top', 'show-back', 'show-bottom', 'show-left', 'show-right'];

  set start(param: boolean) {
    if (param === this._start) {
      return;
    }
    if (param) {
      // automatic slider
      this._intervalHandle = setInterval(() => {
        this.effect = this._array[this.count++ % 6];
      }, this._interval);

      // hide/show controls/btns when hover
      // pause automatic slide when hover
      this._$box.hover(
        () => {
          clearInterval(this._intervalHandle);
        },
        () => {
          this._intervalHandle = setInterval(() => {
            this.effect = this._array[this.count++ % 6];
          }, this._interval);
        }
      );
      this._start = true;
    } else {
      this._$box.off('mouseenter mouseleave');
      clearInterval(this._intervalHandle);
      this._start = false;
    }
  }


  public resize() {
    var x = this._$box[0].offsetWidth, y = this._$box[0].offsetHeight;

    this._compute(x, y);
    this.effect = this.effect;

    this._frontFace && this._frontFace.resize();
    this._backFace && this._backFace.resize();
    this._leftFace && this._leftFace.resize();
    this._rightFace && this._rightFace.resize();
    this._topFace && this._topFace.resize();
    this._bottomFace && this._bottomFace.resize();

  }

  public destroy() {
    this._frontFace && this._frontFace.destroy();
    this._backFace && this._backFace.destroy();
    this._leftFace && this._leftFace.destroy();
    this._rightFace && this._rightFace.destroy();
    this._topFace && this._topFace.destroy();
    this._bottomFace && this._bottomFace.destroy();
  }

  public render() {
    return `
        <box-container>
            <figure front>${this._frontFace ? this._frontFace.render() : ''}</figure>
            <figure back>${this._backFace ? this._backFace.render() : ''}</figure>
            <figure left>${this._leftFace ? this._leftFace.render() : ''}</figure>
            <figure right>${this._rightFace ? this._rightFace.render() : ''}</figure>
            <figure top>${this._topFace ? this._topFace.render() : ''}</figure>
            <figure bottom>${this._bottomFace ? this._bottomFace.render() : ''}</figure>
        </box-container>
        `;
  }

  private _data = [

  ];

  public get data() {
    return this._data;
  }
}
