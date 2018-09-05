import {Region} from '../region';
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
import {reportGlobal} from '../region';
import {ReportPage} from '../../page/report/page';
import {RegionModel, RegionState} from '../region.model';
import {RegionView} from '../region.view';
import {ExplicitRegionView} from './explicit.region.view';

export class ExplicitRegion extends Region {

  // 模型层
  private readonly _model: RegionModel;
  private readonly _view: RegionView;
  protected _graphic: IGraphic;


  constructor(protected _page: ReportPage) {
    super();
    this._model = new RegionModel();
    this._view = new ExplicitRegionView(this, this._model);

    this._page.addChild(this);

    this.init();
  }

  public init() {
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
      });
  }

  get $element() {
    return this._view.$element;
  }

  /**
   * 用户单击mover的时候调用select，进入选中状态
   */
  select() {
    this._model.state = RegionState.selected;
    if (this._graphic) {
      reportGlobal.instance = this._graphic;
      this._graphic.activateConfig();
    }
  }

  /**
   * 点击画布  所有的region、调用unselect方法
   */
  unselect() {
    this._model.state = RegionState.default;
  }

  multiSelect() {
    this._model.state = RegionState.multiSelected;
  }

  multiUnselect() {
    this._model.state = RegionState.default;
  }

  /**
   * 用户双击mover，进入激活状态   此时已经调用了select
   */
  activate() {
    this._model.state = RegionState.activated;
    if (this._graphic) {
      reportGlobal.instance = this._graphic;
      this._graphic.activate();
    }
  }

  /**
   * 点击mask  当前激活的region调用deactivate
   */
  deactivate() {
    this._model.state = RegionState.default;
    if (this._graphic) {
      (<any>this._graphic).deactivate();
    }
  }

  updateTheme(theme: string) {
    if (this._graphic) {
      this._graphic.updateTheme(theme);
    }
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


  /**
   * 模型层关联，展现层关联
   * @param {IGraphic} graphic
   */
  addChild(graphic: IGraphic) {
    this._graphic = graphic;
    this._view.$fill.append(graphic.$element);
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

}
