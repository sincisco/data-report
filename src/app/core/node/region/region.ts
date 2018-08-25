import {ReportPage} from '../canvas/report/report.page';
import {fromEvent, Subscription} from 'rxjs';
import {filter, throttleTime} from 'rxjs/internal/operators';
import {closestNum} from '../../../utils/common';
import {IGraphic} from '../graphic/graphic';


export const reportGlobal: {
  instance: IGraphic
} = {
  instance: null
};

export enum RegionState {
  default, selected, activated
}

export abstract class Region {
  // 持久化状态层
  protected _zIndex: number;
  protected _coordinates: JQuery.Coordinates;

  // 非持久化状态层
  protected _regionState: RegionState = RegionState.default;

  // 模型层
  protected _page: ReportPage;
  protected _graphic: IGraphic;

  // 展现层
  $element: JQuery;
  protected $fill: JQuery;
  protected $mover: JQuery;

  protected constructor(template: string) {
    this.$element = $(template);
    this.$mover = this.$element.find('.u-mover');
  }

  set page(param: ReportPage) {
    this._page = param;
  }

  get page() {
    return this._page;
  }

  set left(param: number) {
    this._coordinates.left = closestNum(param);
  }

  set top(param: number) {
    this._coordinates.top = closestNum(param);
  }

  get coordinates(): JQuery.Coordinates {
    return Object.assign({}, this._coordinates);
  }

  /**
   * 用户单击mover的时候调用select，进入选中状态
   */
  select() {
    this._regionState = RegionState.selected;
    this.$element.addClass('selected');
    if (this._graphic) {
      reportGlobal.instance = this._graphic;
      this._graphic.activateConfig();
    }
  }

  multiSelect() {
    this.$element.addClass('multi-selected');
  }

  /**
   * 点击画布  所有的region、调用unselect方法
   */
  unselect() {
    this._regionState = RegionState.default;
    this.$element.removeClass('selected');
  }

  multiUnselect() {
    this.$element.removeClass('multi-selected');
  }

  /**
   * 用户双击mover，进入激活状态   此时已经调用了select
   */
  activate() {
    this._regionState = RegionState.activated;
    if (this._graphic) {
      reportGlobal.instance = this._graphic;
      this._graphic.activate();
    }
  }

  /**
   * 点击mask  当前激活的region调用deactivate
   */
  deactivate() {
    this._regionState = RegionState.default;
    if (this._graphic) {
      (<any>this._graphic).deactivate();
    }
  }

  updateTheme(theme: string) {
    if (this._graphic) {
      this._graphic.updateTheme(theme);
    }
  }

  abstract refresh();

  public abstract addChild(child: IGraphic);

  /**
   * 1、销毁内部对象
   * 2、解除事件绑定
   * 3、解除当前对象的属性引用
   */
  destroy() {
    if (this._graphic) {
      this._graphic.destroy();
      this._graphic = null;
    }
    this._page.deleteChild(this);
    this._page = null;
    this.$element.remove();
  }

  /**
   * tips:
   * 1、被拖拽元素的z-index是否需要改变  以避免被其他高z-index的region覆盖
   * 2、如果要将一个region拖放到其他容器中，则当前region跟在鼠标后面移动的方式并不可行，因为drop事件会在被拖拽的元素上面触发
   * @private
   */
  protected _bindEventForMover() {
    let count = 0,
      subscription: Subscription,
      originPageX,
      originPageY,
      snapshot: JQuery.Coordinates;

    const dragEndHandler = (event: MouseEvent) => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
        document.removeEventListener('mouseup', dragEndHandler);
        this.$element.removeClass('no-transition');
        resizeTipHelper.hide();
      }
    };

    let timeoutHandle;
    this.$mover
      .on('dragstart', ($event: JQuery.Event) => {
        count = 0;
        this.$element.addClass('no-transition');
        originPageX = $event.pageX;
        originPageY = $event.pageY;
        snapshot = Object.assign({}, this._coordinates);
        resizeTipHelper.show(originPageX, originPageY, this._coordinates.left, this._coordinates.top);

        subscription = fromEvent(document, 'mousemove')
          .pipe(filter(event1 => count++ > 2), throttleTime(30))
          .subscribe((mouseEvent: MouseEvent) => {
            const offsetLeft = mouseEvent.pageX - originPageX,
              offsetTop = mouseEvent.pageY - originPageY;
            this.left = snapshot.left + Math.round(offsetLeft / this._page.scale);
            this.top = snapshot.top + Math.round(offsetTop / this._page.scale);

            resizeTipHelper.refresh(mouseEvent.pageX, mouseEvent.pageY, this._coordinates.left, this._coordinates.top);
            this.refresh();
          });
        document.addEventListener('mouseup', dragEndHandler);
        return false;
      })
      .on('click', ($event: JQuery.Event) => {
        // console.log('click');
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
          timeoutHandle = null;
        } else {
          timeoutHandle = setTimeout(() => {
            $($event.currentTarget).triggerHandler('singleClick', [$event]);
            timeoutHandle = null;
          }, 200);
        }
        $event.stopPropagation();
      }).on('singleClick', ($event: JQuery.Event, $singleClickEvent: JQuery.Event) => {
      console.log('singleClick');
      if ($singleClickEvent.ctrlKey) {
        console.log('ctrl');
        this._page.selectManager.ctrlSelect(this);
      } else {
        this._page.selectManager.select(this);
      }

    }).on('dblclick', ($event: JQuery.Event) => {
      console.log('dblclick');
      this.page.activateRegion(this);
    });
  }


}

class RegionManager {
  constructor() {
  }
}


class ResizeTipHelper {
  private _template = `<div class="u-tip u-tip-grid" style="transform: translate(0px,-50%);left:300px;top:300px;display: none;">
    <span></span></div>`;

  private readonly _$element: JQuery;

  private _$span: JQuery;

  constructor() {
    this._$element = $(this._template);
    this._$span = this._$element.find('span');
  }

  show(left: number, top: number, width: number, height: number) {
    $('body').append(this._$element);
    this.refresh(left, top, width, height);
    this._$element.show();
  }

  refresh(left: number, top: number, width: number, height: number) {
    this._$element.css({
      left,
      top
    });
    this._content(width, height);
  }

  hide() {
    this._$element.hide();
  }

  private _content(x, y) {
    this._$span.text(`${x} × ${y}`);
  }
}

export const resizeTipHelper = new ResizeTipHelper();
