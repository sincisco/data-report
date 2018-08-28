import {SplitPair} from '@core/node/page/dashboard/split.pair';
import {addEventListener1} from '@core/node/page/dashboard/dashboard.canvas';
import {Split} from '@core/node/page/dashboard/split';

export class SplitGutter {
  private _element: HTMLElement;
  private _splitPair: SplitPair;

  private _activeState = false;

  constructor(private _split: Split) {
    const gutter = this._element = document.createElement('div');
    gutter.classList.add('gutter', `gutter-${_split.direction}`);
  }

  public directionChange() {
    $(this._element)
      .removeClass('gutter-horizontal gutter-vertical')
      .addClass(`gutter-${this._split.direction}`);
  }

  public get element() {
    return this._element;
  }

  public set activeState(value: boolean) {
    if (this._activeState === value) {
      return;
    }
    if (value) {
      this._split.element.appendChild(this._element);
    } else {
      $(this._element).detach();
    }
    this._activeState = value;
  }

  public subscribeMousedown(handle) {
    this._element[addEventListener1]('mousedown', handle);
  }


  set order(order: string) {
    this._element.style['order'] = order;
  }


  public set splitPair(value: SplitPair) {
    this._splitPair = value;
    this._setGutterSize(value.parent.gutterSize);
  }

  private get split() {
    return this._splitPair.parent;
  }

  private _setGutterSize(gutSize) {
    const split = this.split;
    const style = {'flex-basis': `${gutSize}px`, 'flex-grow': 0};

    Object.keys(style).forEach(prop => {
      this._element.style[prop] = style[prop];
    });
  }

  public destroy() {
    $(this._element).remove();
    this._element = null;
    this._splitPair = null;
    this._split = null;
  }

}
