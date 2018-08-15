import {ContainerImmutable} from '@core/node/container/container.immutable.interface';
import {Face} from '@core/node/face/face';
// import {FaceEchart} from '@core/node/face/echart.face';

const CUBE_TEMPLATE = `
<div class="chart-container">
    <div class="chart-settings-mask">
    </div>
    <div class="chart-settings-panel">
        <div class="face face-cube face-item" data-attr="front" data-index="1"></div>
        <div class="face face-cube face-item" data-attr="back" data-index="2"></div>
        <div class="face face-cube face-item" data-attr="left" data-index="3"></div>
        <div class="face face-cube face-item" data-attr="right" data-index="4"></div>
        <div class="face face-cube face-item" data-attr="top" data-index="5"></div>
        <div class="face face-cube face-item" data-attr="bottom" data-index="6"></div>
    </div>
    <div class="cube">
        <figure class="front"></figure>
        <figure class="back"></figure>
        <figure class="left"></figure>
        <figure class="right"></figure>
        <figure class="top"></figure>
        <figure class="bottom"></figure>
    </div>
</div>
`;

export class Cube extends ContainerImmutable {
  private _$cube: JQuery;
  private _$front: JQuery;
  private _$back: JQuery;
  private _$left: JQuery;
  private _$right: JQuery;
  private _$top: JQuery;
  private _$bottom: JQuery;

  private _effect: string = 'show-front';

  constructor(private _parent: HTMLElement) {
    super(CUBE_TEMPLATE);

    _parent.appendChild(this._$element[0]);
    var $cube = this._$cube = this._$element.find('.cube');
    this._$front = $cube.find('.front');
    this._$back = $cube.find('.back');
    this._$left = $cube.find('.left');
    this._$right = $cube.find('.right');
    this._$top = $cube.find('.top');
    this._$bottom = $cube.find('.bottom');

    var width = Math.min(this._$element.width(), this._$element.height());

    this._$cube.width(width).height(width);
    this._compute(width);

    this.effect = 'show-bottom';
    this._init();
  }


  private _transformMap;

  private _compute(width) {

    this._$front.css('transform', `rotateY(0deg) translateZ(${width / 2}px)`);
    this._$back.css('transform', `rotateY(180deg) translateZ(${width / 2}px)`);
    this._$left.css('transform', `rotateY(-90deg) translateZ(${width / 2}px)`);
    this._$right.css('transform', `rotateY(90deg) translateZ(${width / 2}px)`);
    this._$top.css('transform', `rotateX(90deg) translateZ(${width / 2}px)`);
    this._$bottom.css('transform', `rotateX(-90deg) translateZ(${width / 2}px)`);

    /* this._transformMap = {
         'show-front': `translateZ( -${y / 2}px) rotateY(0deg)`,
         'show-back': `translateZ( -${y / 2}px) rotateY(-180deg)`,
         'show-left': `translateZ(-${x / 2}px) rotateY(90deg)`,
         'show-right': `translateZ(-${x / 2}px) rotateY(-90deg)`,
         'show-top': `translateZ(-${y / 2}px) rotateX(-90deg)`,
         'show-bottom': `translateZ(-${y / 2}px) rotateX(90deg)`
     }*/
    this._transformMap = {
      'show-front': `translateZ( -${width / 2}px) rotateY(0deg)`,
      'show-back': `translateZ( -${width / 2}px) rotateY(-180deg)`,
      'show-left': `translateZ(-${width / 2}px) rotateY(90deg)`,
      'show-right': `translateZ(-${width / 2}px) rotateY(-90deg)`,
      'show-top': `translateZ(-${width / 2}px) rotateX(-90deg)`,
      'show-bottom': `translateZ(-${width / 2}px) rotateX(90deg)`
    };
  }

  private _array = ['show-back', 'show-right', 'show-front', 'show-left', 'show-top', 'show-bottom'];

  private _init() {
    this._$cube.on('click', (event) => {
      this.effect = this._array[this.count++ % 6];
    });
  }

  private _interval: number = 3000;
  private _intervalHandle;

  set start(param: boolean) {
    if (param === this._start)
      return;
    if (param) {
      // automatic slider
      this._intervalHandle = setInterval(() => {
        this.effect = this._array[this.count++ % 6];
      }, this._interval);

      // hide/show controls/btns when hover
      // pause automatic slide when hover
      this._$cube.hover(
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
      this._$cube.off('mouseenter mouseleave');
      clearInterval(this._intervalHandle);
      this._start = false;
    }
  }


  public render() {
    return `
        <cube-container>
            <figure front>${this._frontFace ? this._frontFace.render() : ''}</figure>
            <figure back>${this._backFace ? this._backFace.render() : ''}</figure>
            <figure left>${this._leftFace ? this._leftFace.render() : ''}</figure>
            <figure right>${this._rightFace ? this._rightFace.render() : ''}</figure>
            <figure top>${this._topFace ? this._topFace.render() : ''}</figure>
            <figure bottom>${this._bottomFace ? this._bottomFace.render() : ''}</figure>
        </cube-container>
        `;
  }


  set effect(key: string) {
    this._effect = key;
    this._$cube.css('transform', this._transformMap[key]);
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
        // this._frontFace = new FaceEchart(this._$front[0], options);
      }
      this.effect = 'show-front';
      this._frontFace.select();

    } else if (index === 2) {
      if (!this._backFace) {
        // this._backFace = new FaceEchart(this._$back[0], options);
      }
      this.effect = 'show-back';
      this._backFace.select();

    } else if (index === 3) {
      if (!this._leftFace) {
        // this._leftFace = new FaceEchart(this._$left[0], options);
      }
      this.effect = 'show-left';
      this._leftFace.select();
    } else if (index === 4) {
      if (!this._rightFace) {
        // this._rightFace = new FaceEchart(this._$right[0], options);
      }
      this.effect = 'show-right';
      this._rightFace.select();
    } else if (index === 5) {
      if (!this._topFace) {
        // this._topFace = new FaceEchart(this._$top[0], options);
      }
      this.effect = 'show-top';
      this._topFace.select();
    } else {
      if (!this._bottomFace) {
        // this._bottomFace = new FaceEchart(this._$bottom[0], options);
      }
      this.effect = 'show-bottom';
      this._bottomFace.select();
    }
  }


  private count = 1;


  public resize() {
    var width = Math.min(this._parent.clientWidth, this._parent.clientHeight);

    this._$cube.width(width).height(width);
    this._compute(width);

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

  private _data = [
    {
      'name': '图表-front', 'value': '', 'group': '图表', index: 1, 'editor': {
        'type': 'combobox',
        'options': {
          'data': [
            {
              'text': 'none',
              'value': ''
            }, {
              'text': 'one',
              'value': 'one'
            }, {
              'text': 'two',
              'value': 'two'
            }
          ],
          'valueField': 'value',
          'textField': 'text',
          'editable': false,
          'panelHeight': 120,
          'required': true
        }

      }
    },
    {
      'name': '图表-back', 'value': '', 'group': '图表', index: 2, 'editor': {
        'type': 'combobox',
        'options': {
          'data': [
            {
              'text': 'none',
              'value': ''
            }, {
              'text': 'one',
              'value': 'one'
            }, {
              'text': 'two',
              'value': 'two'
            }
          ],
          'valueField': 'value',
          'textField': 'text',
          'editable': false,
          'panelHeight': 120,
          'required': true
        }

      }
    },
    {
      'name': '图表3', 'value': '', 'group': '图表', index: 3, 'editor': {
        'type': 'combobox',
        'options': {
          'data': [
            {
              'text': 'none',
              'value': ''
            }, {
              'text': 'one',
              'value': 'one'
            }, {
              'text': 'two',
              'value': 'two'
            }
          ],
          'valueField': 'value',
          'textField': 'text',
          'editable': false,
          'panelHeight': 120,
          'required': true
        }

      }
    }
  ];

  public get data() {
    return this._data;
  }
}
