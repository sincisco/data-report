import {RegionController} from '../region.controller';
import {clipboard} from '../../clipboard';
import {RegionModel, RegionState} from '../region.model';
import {ExplicitRegionView} from './explicit.region.view';
import {IReportPage} from '@core/node/page/report/page.interface';

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
 * 不要用控制器做下面的事情：
 * 1、ＤＯＭ操作：使用AngularJs中的数据双向绑定和自定义指令执行操作
 * 2、表单处理：使用Angular中的form controls进行操作
 * 3、 数据格式化展示：使用Angular中的过滤器Filter来进行操作
 * 4、不同控制器之间的数据共享：使用Angular中的自定义服务Service进行处理
 * 那么如何进行不同作用域之间的访问呢，在Angularjs中对于作用域访问有个$rootScope 。
 * 在这里有三个函数需要介绍下，
 * $on(name,handler)  注册一个事件处理函数，该函数在特定的事件被当前作用域收到时将被调用。
 * $emit(name,args)   向当前父作用域发送一个事件，直至根作用域。
 * $broadcast(name,args) 向当前作用域下的子作用域发送一个事件，参数是事件名称以及一个用于作用向事件提供额外数据的对象。
 *
 * 1、由Controller创建相关model
 */
/**
 * 1、创建模型并初始化  模型数据是独立的
 */
export class ExplicitRegion extends RegionController {

  constructor(protected _page: IReportPage) {
    super();
    this._model = new RegionModel();
    this._view = new ExplicitRegionView(this, this._model);

    this._page.addChild(this);

    this._init();
  }

  init(regionOption: any) {
    this._model.importModel(regionOption);
    this._view.refresh();
  }

  private _init() {
    this._view
      .addEventListener('select', () => {
        this._page.select(this);
      })
      .addEventListener('ctrlSelect', () => {
        this._page.ctrlSelect(this);
      })
      .addEventListener('resizeEnd', () => {
        if (this._graphicWrapper) {
          this._graphicWrapper.resize();
        }
      })
      .addEventListener('activateRegion', () => {
        this._page.activateRegion(this);
      });

    this._view.contextMenuGenerator = () => {
      return [{
        displayName: '复制',
        shortcut: 'Ctrl+C',
        callback: () => {
          console.log('复制');
          clipboard.saveData(this.getOption());
          console.log(this.getOption());
          return false;
        }
      },
        {
          displayName: '剪切',
          shortcut: 'Ctrl+X'
        }, {
          displayName: '删除',
          shortcut: 'Backspace',
          callback: () => {
            if (this.page.isSelected(this)) {
              const arr = this.page.selectedArray;
              arr.forEach((value) => {
                value.destroy();
              });
            } else {
              this.destroy();
            }

            return false;
          }
        }, 'split'];
    };
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
    if (param === RegionState.selected && this._graphicWrapper) {
      this._graphicWrapper.activateConfig();
    } else if (param === RegionState.activated && this._graphicWrapper) {
      this._graphicWrapper.activate();
    } else if (this._model.state === RegionState.activated && param === RegionState.default && this._graphicWrapper) {
      (<any>this._graphicWrapper).deactivate();
    }
    this._model.state = param;
  }

  getOption() {
    const retObj = {
      region: {
        regionKey: 'explicit.region',
        regionOption: this._model.exportModel(),
      },
      graphic: this._graphicWrapper.getOption()
    };
    console.log('XXXXXX ', JSON.stringify(retObj));
    return retObj;
  }
}
