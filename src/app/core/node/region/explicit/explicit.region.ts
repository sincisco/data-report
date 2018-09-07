import {RegionController} from '../region.controller';
import {closestNum} from '../../../../utils/common';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {fromEvent, Subscription} from 'rxjs';
import {throttleTime} from 'rxjs/internal/operators';
import {TextAuxiliary} from '../../graphic.view/auxiliary/text.auxiliary';
import {CoordinatesAndDimensions, Dimensions} from '../../interface';
import {IGraphic} from '../../graphic/graphic';
import {TextGraphic} from '../../graphic/auxiliary.graphic/text.graphic';
import {clipboard} from '../../clipboard';
import {BarChartGraphic} from '../../graphic/chart.graphic/bar.chart.graphic';
import {LineChartGraphic} from '../../graphic/chart.graphic/line.chart.graphic';
import {PieChartGraphic} from '../../graphic/chart.graphic/pie.chart.graphic';
import {LinesChartGraphic} from '../../graphic/chart.graphic/lines.chart.graphic';
import {reportGlobal} from '../region.controller';
import {ReportPage} from '../../page/report/page';
import {RegionModel, RegionState} from '../region.model';
import {RegionView} from '../region.view';
import {ExplicitRegionView} from './explicit.region.view';

/**
 *
 * angularjs
 * 控制器是AngularJS的核心之一，它的作用主要是对视图中的数据和事件处理函数进行挂载，
 * 同时进行一定的业务功能的底层封装和处理
 *
 * 控制器的作用
 * 1、通过$scope进行数据状态的初始化操作
 * 2、通过$scope进行事件处理函数的挂载操作
 * 控制器的使用注意事项
   不要用控制器做下面的事情：
   1、ＤＯＭ操作：使用AngularJs中的数据双向绑定和自定义指令执行操作
   2、表单处理：使用Angular中的form controls进行操作
   3、 数据格式化展示：使用Angular中的过滤器Filter来进行操作
   4、不同控制器之间的数据共享：使用Angular中的自定义服务Service进行处理

 那么如何进行不同作用域之间的访问呢，在Angularjs中对于作用域访问有个$rootScope 。
 在这里有三个函数需要介绍下，
 $on(name,handler)  注册一个事件处理函数，该函数在特定的事件被当前作用域收到时将被调用。
 $emit(name,args)   向当前父作用域发送一个事件，直至根作用域。
 $broadcast(name,args) 向当前作用域下的子作用域发送一个事件，参数是事件名称以及一个用于作用向事件提供额外数据的对象。
 *
 * 1、由Controller创建相关model
 */
export class ExplicitRegion extends RegionController {

  constructor(protected _page: ReportPage) {
    super();
    this._model = new RegionModel();
    this._view = new ExplicitRegionView(this, this._model);

    this._page.addChild(this);

    this._init();
  }

  private _init() {
    this._view
      .addEventListener('select', () => {
        this._page.selectManager.select(this);
      })
      .addEventListener('ctrlSelect', () => {
        this._page.selectManager.ctrlSelect(this);
      })
      .addEventListener('resizeEnd', () => {
        if (this._graphic) {
          this._graphic.resize();
        }
      })
      .addEventListener('activateRegion', () => {
        this._page.activateRegion(this);
      });

    this._view.addContextMenu([{
      displayName: '复制',
      shortcut: 'Ctrl+C',
      callback: () => {
        console.log('复制');
        // clipboard.saveData(this.getOption());
        // console.log(this.getOption());
        // clipboard.saveData(this.derender());
        // console.log(this.derender());
        // contextMenuHelper.close();
        return false;
      }
    }]);
  }

  /**
   * 用户单击mover的时候调用select，进入选中状态
   *
   * unselect 点击画布  所有的region、调用unselect方法
   *
   * 用户双击mover，进入激活状态   此时已经调用了select
   *
   * 点击mask  当前激活的region调用deactivate
   */
  set state(param: RegionState) {
    if (param === RegionState.selected && this._graphic) {
      reportGlobal.instance = this._graphic;
      this._graphic.activateConfig();
    } else if (param === RegionState.activated && this._graphic) {
      reportGlobal.instance = this._graphic;
      this._graphic.activate();
    } else if (this._model.state === RegionState.activated && param === RegionState.default && this._graphic) {
      (<any>this._graphic).deactivate();
    }
    this._model.state = param;
  }

  getOption() {
    // if (this._graphic) {
    //   return Object.assign({graphic: this._graphic.getOption(), graphicClass: this._graphic.constructor}, this._dimensions);
    // }
  }

  derender() {
    const retObj = {
      regionClass: 'explicit.region',
      option: this._model.exportModel(),
      graphic: this._graphic ? this._graphic.getOption() : undefined
    };

    return retObj;
  }

  render(option) {
    // if (option.coordinates) {
    //   this._coordinates = option.coordinates;
    // }
    // this._dimensions = option.dimensions;
  }

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
    this._page.removeChild(this);
    this._page = null;

    this._view.destroy();
  }

}
