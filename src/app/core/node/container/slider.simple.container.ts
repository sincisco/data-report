import {ContainerAlterable} from '@core/node/container/container.alterable.interface';
// import {FaceEchart} from '@core/node/face/echart.face';
import {Face} from '@core/node/face/face';

const SLIDER_SIMPLE_TEMPLATE = `
<div class="chart-container">
    <div class="chart-settings-mask"></div>
    <div class="chart-settings-panel alterable">
        <div class="face face-item"></div>
        <div class="face face-item"></div>
        <div class="face face-item"></div>
    </div>
    <div class="slider-wrap">
              <div class="slider">
              </div>
              <div class="btns next"><i class="fa fa-chevron-right"></i></div>
              <div class="btns previous"><i class="fa fa-chevron-left"></i></div>
              <div class="pagination-wrap">
                <ul>
                </ul>
              </div>
    </div>
</div>
`;

class SliderSimpleContainer extends ContainerAlterable {
    private _pos: number = 0;

    private _$sliderWrapper: JQuery;
    private _$slider: JQuery;
    private _$paginationWrapper: JQuery;

    private _interval: number = 5000;

    constructor(parent: HTMLElement) {
        super(SLIDER_SIMPLE_TEMPLATE);
        const $element = this._$element;
        parent.appendChild($element[0]);
        this._$sliderWrapper = $element.find('.slider-wrap');
        this._$slider = $element.find('.slider');
        this._$paginationWrapper = $element.find('.pagination-wrap');

        this.init();
    }


    setChart(options: any, index: number) {
        if (!this.getFace(index)) {
            // this.setFace(index, new FaceEchart(this._$slider.find('figure').eq(index - 1)[0], options))
        }
        this.getFace(index).select();
    }

    get sliderWidth(): number {
        return this._$sliderWrapper.width();
    }

    get sliderNumber() {
        return this._$sliderWrapper.find('figure').length;
    }

    init() {
        const $sliderWrapper = this._$sliderWrapper;

        // next slide
        $sliderWrapper.find('.next').click(() => {
            this._slideRight();
        });

        // previous slide
        $sliderWrapper.find('.previous').click(() => {
            this._slideLeft();
        });

        // for each slide
        this._$settingPanel.find('.face-item').each((index, element) => {
            //set its color
            $sliderWrapper.find('.slider').append('<figure></figure>');
            //create a pagination
            $sliderWrapper.find('.pagination-wrap ul').append('<li></li>');
        })

        // pagination
        this._pagination();


    }

    private _intervalHandle;

    set start(param: boolean) {
        if (param === this._start)
            return;
        if (param) {
            // automatic slider
            this._intervalHandle = setInterval(this._slideRight.bind(this), this._interval);

            // hide/show controls/btns when hover
            // pause automatic slide when hover
            this._$sliderWrapper.hover(
                () => {
                    this._$sliderWrapper.addClass('active');
                    clearInterval(this._intervalHandle);
                },
                () => {
                    this._$sliderWrapper.removeClass('active');
                    this._intervalHandle = setInterval(this._slideRight.bind(this), this._interval);
                }
            );
            this._start = true;
        } else {
            this._$sliderWrapper.off('mouseenter mouseleave');
            clearInterval(this._intervalHandle);
            this._start = false;
        }
    }


    appendItem() {
        this._$slider.append('<figure></figure>');
        this._$paginationWrapper.find('ul').append('<li></li>');
    }

    deleteItem(index) {
        // 1、清空figure内部的图表  2、删除figure  3、重新计算交互尺寸
        console.log(index);
        var face = this.getFace(index + 1);
        face.destroy();
        this.removeFace(index + 1);
        this._$slider.find('figure').eq(index).remove();
        this._$paginationWrapper.find('li').eq(index).remove();
    }


    render() {
        var figures = '';
        this._$slider.find('figure').each((index, element) => {
            figures += `
            <figure>${this.getFace(index + 1) ? this.getFace(index + 1).render() : ''}</figure>
            `;
        })
        return `
        <slider-simple>${figures}</slider-simple>
        `;
    }

    resize() {
        this._faceArray.forEach((value: Face) => {
            if (value) {
                value.resize();
            }
        });
    }

    destroy() {
        this._faceArray.forEach((value: Face) => {
            if (value) {
                value.destroy();
            }
        });
    }

    get minFaceNumber() {
        return 3;
    }

    get maxFaceNumber() {
        return 8;
    }

    private _slideLeft() {
        this._pos--;
        if (this._pos == -1) {
            this._pos = this.sliderNumber - 1;
        }
        this._$slider.css('transform', `translateX(${-(this.sliderWidth * this._pos)}px)`);

        this._pagination();
    }

    private _slideRight() {
        this._pos++;
        if (this._pos == this.sliderNumber) {
            this._pos = 0;
        }
        this._$slider.css('transform', `translateX(${-(this.sliderWidth * this._pos)}px)`);

        // *> optional
        this._pagination();
    }

    private _pagination() {
        this._$paginationWrapper
            .find('li')
            .removeClass('active')
            .eq(this._pos)
            .addClass('active');
    }
}
