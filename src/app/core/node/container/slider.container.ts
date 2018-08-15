import {Container} from '@core/node/container/container.interface';
// import {FaceEchart} from '@core/node/face/echart.face';
import {Face} from '@core/node/face/face';

const CONTAINER_SLIDER_TEMPLATE = `
<div class="chart-container">
    <div class="chart-settings-mask"></div>
    <div class="chart-settings-panel">
        <div class="face face-slider" data-index="1">face1</div>
    </div>
    <div class="x-slider">
        <ul class="slider-figure-wrapper">
              <li><img src="images/slider-5.jpg"></li>
              <li><img src="images/slider-1.jpg"></li>
              <li><img src="images/slider-2.jpg"></li>
              <li><img src="images/slider-3.jpg"></li>
              <li><img src="images/slider-4.jpg"></li>
              <li><img src="images/slider-5.jpg"></li>
              <li><img src="images/slider-1.jpg"></li>
        </ul>
    </div>
</div>
`;

class SliderContainer extends Container {
  private _$slider: JQuery;
  private _$figure: JQuery;

  constructor(parent: HTMLElement) {
    super(CONTAINER_SLIDER_TEMPLATE);
    let $slider = this._$slider = this._$element.find('.x-slider');
    this._$figure = this._$slider.find('figure');

    parent.appendChild(this._$element[0]);
    this._init($slider, {
      current: 0,
      speed: 500,
      intervalTime: 2000
    });
  }


  private _face: Face;

  public setChart(options: any, index: number) {
    if (!this._face) {
      // this._face = new FaceEchart(this._$figure[0], options);
      this._$figure.removeClass('no-chart');
    }
    this._face.select();
  }

  private config: {
    w: number,
    current: number,
    speed: number,
    intervalTime: number
  };

  private userConfig: {
    w?: number,
    current?: number,
    speed?: number,
    intervalTime?: number
  };


  private _init($slider: JQuery, userConfig) {
    let that = this;


    let width = $slider.width(),
      height = $slider.height();

    // 参数配置
    this.userConfig = userConfig;
    this.config = {
      w: $slider.width(),
      current: 0,
      speed: 500,
      intervalTime: 5000
    };
    if (userConfig != null) {
      $.extend(this.config, this.userConfig);
    }


    // 保存查找dom元素
    let slider_ul = $slider.children('.slider-figure-wrapper');
    let slider_ul_li = slider_ul.children('li');


    slider_ul.find('img').width(width);
    slider_ul.find('img').height(height);
    // 初始化左右按钮
    $slider.append('<a href="javascript:" class="slider-btn slider-btn-left">&lt;</a>');
    $slider.append('<a href="javascript:" class="slider-btn slider-btn-right">&gt;</a>');
    let slider_btn_left = $slider.children('.slider-btn-left');
    let slider_btn_right = $slider.children('.slider-btn-right');

    // 初始化圆点
    $slider.append('<div class="slider-dot"><ul></ul></div>');
    let slider_dot = $slider.children('.slider-dot');
    let slider_dot_ul = slider_dot.children('ul');
    let slider_img_length = slider_ul_li.length;
    for (let i = 0; i < slider_img_length - 2; i++) {
      if (i === this.config.current) {
        slider_dot_ul.append('<li class="active"></li>');
      } else {
        slider_dot_ul.append('<li></li>');
      }
    }
    let slider_dot_ul_li = slider_dot_ul.children('li');

    // 初始化默认显示图片位置
    slider_ul.css('left', -this.config.w * this.config.current - this.config.w);

    // 圆点切换点亮
    let active = function (i) {
      slider_dot_ul_li.removeClass('active');
      slider_dot_ul_li.eq(i).addClass('active');
    };


    // 右点击事件
    slider_btn_right.on('click', function (event) {
      event.preventDefault();
      if (that.config.current < slider_img_length - 2) {
        toggleInterval();
        that.config.current++;
        if (that.config.current != slider_img_length - 2) {
          slider_ul
            .stop(true, false)
            .animate(
              {left: -that.config.w * that.config.current - that.config.w},
              that.config.speed,
              function () {
                active(that.config.current);
              });
        }
        if (that.config.current === slider_img_length - 2) {
          slider_ul
            .stop(true, false)
            .animate(
              {left: -that.config.w * that.config.current - that.config.w},
              that.config.speed,
              function () {
                slider_ul.css('left', -that.config.w);
                that.config.current = 0;
                active(that.config.current);
              });
        }
      }
    });

    // 左点击事件
    slider_btn_left.on('click', function (event) {
      event.preventDefault();
      if (that.config.current > -1) {
        toggleInterval();
        that.config.current--;
        if (that.config.current != -1) {
          slider_ul
            .stop(true, false)
            .animate(
              {left: -that.config.w * that.config.current - that.config.w},
              that.config.speed,
              function () {
                active(that.config.current);
              });
        }
        if (that.config.current === -1) {
          slider_ul
            .stop(true, false)
            .animate(
              {left: 0},
              that.config.speed,
              function () {
                slider_ul.css('left', -that.config.w * (slider_img_length - 2));
                that.config.current = slider_img_length - 3;
                active(that.config.current);
              });
        }
      }
    });

    // dot点击事件
    slider_dot_ul_li.on('click', function (event) {
      event.preventDefault();
      toggleInterval();
      let index = $(this).index();
      active(index);
      slider_ul
        .stop(true, false)
        .animate(
          {left: -that.config.w * index - that.config.w},
          that.config.speed,
          function () {
            that.config.current = index;
          });
    });

    // 自动切换
    let sliderInt = setInterval(sliderInterval, that.config.intervalTime);

    // 判断图片切换
    function sliderInterval() {
      if (that.config.current < slider_img_length - 2) {
        that.config.current++;
        slider_ul.stop(true, false)
          .animate({left: -that.config.w * that.config.current - that.config.w},
            that.config.speed,
            function () {
              active(that.config.current);
              if (that.config.current === slider_img_length - 2) {
                slider_ul.css('left', -that.config.w);
                that.config.current = 0;
                active(that.config.current);
              }
            });
      }
    }

    // 重置计时器
    function toggleInterval() {
      clearInterval(sliderInt);
      sliderInt = setInterval(sliderInterval, that.config.intervalTime);
    }


  }

  render() {
    return `
        <div class="simple-container"></div>
        `;
  }

  public resize() {
    this._face && this._face.resize();
  }

  private _data = [];

  public get data() {
    return this._data;
  }

  destroy() {

  }

  set start(param: boolean) {
  }
}

