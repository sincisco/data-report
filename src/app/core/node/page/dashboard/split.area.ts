import {addEventListener1, isString, NOOP} from '@core/node/page/dashboard/dashboard.canvas';
import {contextMenuHelper} from '../../../../utils/contextMenu';
import {Split} from '@core/node/page/dashboard/split';
import {SplitPair} from '@core/node/page/dashboard/split.pair';
import {Container} from '@core/node/container/container.interface';
import {Card} from '@core/node/container/card.container';
import {Cube} from '@core/node/container/cube.container';
import {Box} from '@core/node/container/box.container';
import {CarouselRotate} from '@core/node/container/carousel.container';

let count = 0, dragSourcePair: SplitPair;

export class SplitArea {
  private _name: string;
  private _element: HTMLElement;
  private _splitPair: SplitPair;

  private _activeState = false;
  private _resizable = false;

  private _child: Split | Container;

  constructor(private _split: Split, private _size: string | number, public minSize: any) {
    const element = this._element = document.createElement('div');
    element.classList.add('split-area');
    element.draggable = true;
    element.dataset.attr = this._name = (this._split.name + '' + count++);
    element.addEventListener('dragstart', () => {
      console.log('dragstart');
      dragSourcePair = this._splitPair;
      event.stopPropagation();
    });
    element.addEventListener('dragover', (event) => {
      if (dragSourcePair !== this._splitPair && (dragSourcePair.parent === this._split)) {
        event.preventDefault();
      }
      event.stopPropagation();
    });
    element.addEventListener('drop', (event) => {
      console.log(event.offsetX, event.offsetY);
      console.log(event);
      console.log(this._element.offsetWidth);
      if (event.offsetX * 2 < this._element.offsetWidth) {
        this._splitPair.dragInsertBefore(dragSourcePair);
      } else {
        // this._splitPair.dragInsertAfter();
      }
      event.preventDefault();
      event.stopPropagation();
    });
    element.addEventListener('click', (event) => {
      console.log(this.element);
      // propertyGrid.loadData(this._option);
      // propertyGrid.afterEdit = (index, row, changes) => {
      //   if (row.name === 'fixed width') {
      //     this.size = row.value;
      //   }
      //   if (row.name === '背景图') {
      //     $('.canvas')
      //       .removeClass('one two three four')
      //       .addClass(row.value);
      //   }
      //   if (row.name === '长宽比') {
      //     console.log(row);
      //     $('.aspectration')
      //       .attr('data-ratio', row.value);
      //   }
      // };
      event.stopPropagation();
      return false;
    });

    $(element).contextmenu((event) => {
      contextMenuHelper.open(this.split.menuConfig.concat(this.menuConfig), event.pageX, event.pageY, event);
      $(this._element).addClass('activated');
      $(this.split.element).addClass('activated');
      contextMenuHelper.callback = () => {
        $(this._element).removeClass('activated');
        $(this.split.element).removeClass('activated');
      };
      return false;
    });
  }

  private _data = [

  ];

  render() {
    let style = '';
    if (this.resizable) {
      style = `flex-basis:1px;flex-grow:${this._size};`;
    } else {
      style = `flex-basis:${this._size};flex-grow:0;flex-shrink:0;`;
    }
    return `
    <div class="split-area" style="${style}">${this._child ? this._child.render() : this._name}</div>`;
  }

  public get element() {
    return this._element;
  }

  public get resizable() {
    return this._resizable;
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

  public directionChange() {

  }

  public destroy() {
    $(this._element).remove();
    this._splitPair = null;
  }

  private _init() {

  }

  set splitPair(value: SplitPair) {
    this._splitPair = value;
  }

  private get split(): Split {
    return this._split;
  }


  disableSelection() {
    this._element[addEventListener1]('selectstart', NOOP);
    this._element[addEventListener1]('dragstart', NOOP);

    this._element.style.userSelect = 'none';
    this._element.style.webkitUserSelect = 'none';
    (<any>this._element.style).MozUserSelect = 'none';
    this._element.style.pointerEvents = 'none';
  }

  recoverSelection() {
    this._element[addEventListener1]('selectstart', NOOP);
    this._element[addEventListener1]('dragstart', NOOP);

    this._element.style.userSelect = '';
    this._element.style.webkitUserSelect = '';
    (<any>this._element.style).MozUserSelect = '';
    this._element.style.pointerEvents = '';
  }

  // 3. Define the dragging helper functions, and a few helpers to go with them.
  // Each helper is bound to a pair object that contains its metadata. This
  // also makes it easy to store references to listeners that that will be
  // added and removed.
  //
  // Even though there are no other functions contained in them, aliasing
  // this to self saves 50 bytes or so since it's used so frequently.
  //
  // The pair object saves metadata like dragging state, position and
  // event listener references.

  set order(order: string) {
    this._element.style['order'] = order;
  }

  get menuConfig(): Array<any> {
    return [
      {
        displayName: '新建 split',
        callback: () => {
          const dom = document.createElement('div');
          this._child = new Split(dom, {sizes: [30, 50, 20]});
          $(this._element).empty();
          this._element.appendChild(dom);
        }
      },
      'split',
      {
        displayName: '插入area (前)',
        callback: () => {
          this._splitPair.insertBefore();
        }
      },
      {
        displayName: '插入area (后)',
        callback: () => {
          this._splitPair.insertAfter();
        }
      },
      {
        displayName: '删除 area',
        callback: () => {
          this._splitPair.remove(true);
          this._split.resize();
        }
      },
      'split',
      {
        displayName: '新建图表容器',
        children: [
          {
            displayName: '新建 simple',
            callback: () => {
              // const simple = this._child = new SimpleContainer();
              // $(this._element).empty();
              // this._element.appendChild(simple.$element[0]);
            }
          },
          {
            displayName: '新建 card',
            callback: () => {
              const card = this._child = new Card();
              $(this._element).empty();
              this._element.appendChild(card.$element[0]);
            }
          },
          {
            displayName: '新建 cube',
            callback: () => {
              $(this._element).empty();
              const cube = this._child = new Cube(this._element);
              // this._element.appendChild(cube.$element[0]);
            }
          },
          {
            displayName: '新建 box',
            callback: () => {
              $(this._element).empty();
              const box = this._child = new Box(this._element);

              // this._element.appendChild(box.$element[0]);
            }
          },
          {
            displayName: '新建 carousel',
            callback: () => {
              $(this._element).empty();
              const carousel = this._child = new CarouselRotate(this._element);
              // this._element.appendChild(carousel.$element[0]);
            }
          },
          {
            displayName: '新建 slider',
            callback: () => {
              $(this._element).empty();
              // const slider = this._child = new SliderSimpleContainer(this._element);

              // this._element.appendChild(carousel.$element[0]);
            }
          },
          {
            displayName: '新建 slider one',
            callback: () => {
              $(this._element).empty();
              // const slider = this._child = new SliderContainer(this._element);

              // this._element.appendChild(carousel.$element[0]);
            }
          }
        ]
      }
    ];
  }

  public set size(value: number | string) {
    let style;
    if (isString(value)) {
      const exp = /^[1-9]\d*px$/i;
      if (exp.test(<string>value)) {
        style = this._elementStyleFixed(value);
        this._size = value;
        this._resizable = false;
      } else {
        throw new Error(`${value} 不是合法长度；`);
      }
    } else {
      style = this._elementStyle(value, null);
      this._size = value;
      this._resizable = true;
    }
    Object.keys(style).forEach(prop => {
      this._element.style[prop] = style[prop];
    });
  }

  public get size(): string | number {
    return <number>this._size;
  }

  private _setElementSize(size, gutSize) {
    const style = this._elementStyle(size, gutSize);
    // Split.js allows setting sizes via numbers (ideally), or if you must,
    // by string, like '300px'. This is less than ideal, because it breaks
    // the fluid layout that `calc(% - px)` provides. You're on your own if you do that,
    // make sure you calculate the gutter size by hand.
    Object.keys(style).forEach(prop => {
      this._element.style[prop] = style[prop];
    });
  }


  private _elementStyle(size, gutSize) {
    const split = this.split;

    // style[split.dimension] = isString(size) ? size : `${calc}(${size}% - ${gutSize}px)`;

    return {
      'flex-basis': '1px',
      'flex-grow': size
    };
  }

  private _elementStyleFixed(size) {
    return {
      'flex-basis': size,
      'flex-grow': 0,
      'flex-shrink': 0
    };
  }

  resize() {
    if (this._child) {
      this._child.resize();
    }
  }

  startAnimation() {
    if (this._child) {
      this._child.start = true;
    }
  }

  stopAnimation() {
    if (this._child) {
      this._child.start = false;
    }
  }

}
