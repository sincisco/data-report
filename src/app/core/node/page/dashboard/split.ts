import {SplitPair} from '@core/node/page/dashboard/split.pair';
import {getBoundingClientRect, HORIZONTAL, NOOP} from '@core/node/page/dashboard/dashboard.canvas';

let splitCount = 0;

export class Split {

  private readonly _id: number;
  private readonly _element: HTMLElement;

  private _direction: string;

  private _dimension;
  private _clientAxis;
  private _position;
  private _cursor: string;

  private _snapOffset;
  private _gutterSize;

  private _dragStart: Function;
  private _drag: Function;
  private _dragEnd: Function;

  private _headPair: SplitPair;
  private _tailPair: SplitPair;

  constructor(root: HTMLElement, options: any) {
    this._id = splitCount++;
    this._element = root;
    root.classList.add('split');

    this._dragStart = getOption(options, 'onDragStart', NOOP);
    this._drag = getOption(options, 'onDrag', NOOP);
    this._dragEnd = getOption(options, 'onDragEnd', NOOP);

    this.direction = getOption(options, 'direction', HORIZONTAL);
    this._cursor = getOption(options, 'cursor', this._direction === HORIZONTAL ? 'ew-resize' : 'ns-resize');

    // const parentFlexDirection = global.getComputedStyle(root).flexDirection

    // Set default options.sizes to equal percentages of the parent element.
    const sizes = getOption(options, 'sizes', ['50px', '50px']);

    // Standardize minSize to an array if it isn't already. This allows minSize
    // to be passed as a number.
    const minSize = getOption(options, 'minSize', 100);
    const minSizes = Array.isArray(minSize) ? minSize : sizes.map(() => minSize);
    this._gutterSize = getOption(options, 'gutterSize', 7);
    this._snapOffset = getOption(options, 'snapOffset', 30);


    // 5. Create pair and element objects. Each pair has an index reference to
    // elements `a` and `b` of the pair (first and second elements).
    // Loop through the elements while pairing them off. Every pair gets a
    // `pair` object, a gutter, and isFirst/isLast properties.
    //
    // Basic logic:
    //
    // - Starting with the second element `i > 0`, create `pair` objects with
    //   `a = i - 1` and `b = i`
    // - Set gutter sizes based on the _pair_ being first/last. The first and last
    //   pair have gutterSize / 2, since they only have one half gutter, and not two.
    // - Create gutter elements and add event listeners.
    // - Set the size of the elements, minus the gutter sizes.
    //
    // -----------------------------------------------------------------------
    // |     i=0     |         i=1         |        i=2       |      i=3     |
    // |             |       isFirst       |                  |     isLast   |
    // |           pair 0                pair 1             pair 2           |
    // |             |                     |                  |              |
    // -----------------------------------------------------------------------
    let previousPair: SplitPair;
    sizes.forEach((size, i) => {
      // Create the area object.


      // Create the pair object with its metadata.
      const pair = new SplitPair(this, previousPair, size, minSizes[i]),
        splitArea = pair.splitArea;

      if (i === sizes.length - 1) {
        this._tailPair = pair;
      } else if (i === 0) {
        this._headPair = pair;
      }

      if (previousPair) {
        previousPair.nextPair = pair;
      }

      previousPair = pair;

      // Set the element size to our determined size.
      // Half-size gutters for first and last elements.
      if (i === 0 || i === sizes.length - 1) {
        splitArea.size = size;
        // splitArea.setElementSize(size, this._gutterSize / 2);
      } else {
        splitArea.size = size;
        // splitArea.setElementSize(size, this._gutterSize);
      }

      const computedSize = splitArea.element.getBoundingClientRect()[this._dimension];

      if (computedSize < splitArea.minSize) {
        splitArea.minSize = computedSize;
      }
    });

    this.refresh();
  }

  render(isRoot?: boolean) {
    let splitPair: SplitPair = this.headPair, content = '';
    while (splitPair) {
      content += splitPair.render();
      splitPair = splitPair.nextPair;
    }

    return `
<div class="${this._direction === HORIZONTAL ? 'split-horizontal' : 'split-vertical'} ${isRoot ? 'top-split' : 'split'}">
    ${content}
</div>
`;
  }

  public refresh() {
    let count = 1, splitPair = this.headPair;
    while (splitPair) {
      splitPair.refresh(!splitPair.isHead, true);
      splitPair.area.activeState = true;
      splitPair.order = count;
      count += 2;
      splitPair = splitPair.nextPair;
    }
  }

  get name() {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'][this._id];
  }

  get element(): HTMLElement {
    return this._element;
  }

  get direction() {
    return this._direction;
  }

  get ClientAxis() {
    return this._clientAxis;
  }

  get dimension() {
    return this._dimension;
  }

  get position() {
    return this._position;
  }

  get cursor() {
    return this._cursor;
  }

  get snapOffset() {
    return this._snapOffset;
  }

  get gutterSize() {
    return this._gutterSize;
  }

  set headPair(value) {
    this._headPair = value;
  }

  get headPair() {
    return this._headPair;
  }

  set tailPair(value) {
    this._tailPair = value;
  }

  get tailPair() {
    return this._tailPair;
  }

  // 2. Initialize a bunch of strings based on the direction we're splitting.
  // A lot of the behavior in the rest of the library is paramatized down to
  // rely on CSS strings and classes.
  set direction(value) {
    this._direction = value;
    if (this._direction === HORIZONTAL) {
      this._dimension = 'width';
      this._clientAxis = 'clientX';
      this._position = 'left';
      this._cursor = 'ew-resize';
      $(this._element)
        .removeClass('split-vertical')
        .addClass('split-horizontal');
    } else if (this._direction === 'vertical') {
      this._dimension = 'height';
      this._clientAxis = 'clientY';
      this._position = 'top';
      this._cursor = 'ns-resize';
      $(this._element)
        .removeClass('split-horizontal')
        .addClass('split-vertical');
    }
    let pair = this._headPair;
    while (pair) {
      pair.directionChange();
      pair = pair.nextPair;
    }
  }

  onDragStart() {
    this._dragStart();
  }

  onDrag() {
    this._drag();
  }

  onDragEnd() {
    this._dragEnd();
  }

  resize() {
    let splitPair = this.headPair;
    while (splitPair) {
      splitPair.resize();
      splitPair = splitPair.nextPair;
    }
  }

  start() {
    let splitPair = this.headPair;
    while (splitPair) {
      splitPair.startAnimation();
      splitPair = splitPair.nextPair;
    }
  }

  stop() {
    let splitPair = this.headPair;
    while (splitPair) {
      splitPair.stopAnimation();
      splitPair = splitPair.nextPair;
    }
  }

  private _remove() {
    let splitPair = this.headPair;
    let next: SplitPair;
    while (splitPair) {
      next = splitPair.nextPair;
      splitPair.remove();
      splitPair = next;
    }
    $(this.element).remove();
  }

  public get menuConfig(): Array<any> {
    return [
      {
        displayName: '水平分割',
        callback: () => {
          this.direction = 'horizontal';
        }
      }, {
        displayName: '垂直分割',
        callback: () => {
          this.direction = 'vertical';
        }
      }, {
        displayName: '删除 split',
        callback: () => {
          this._remove();
        }
      }, 'split'
    ];
  }
}

// Helper function gets a property from the properties object, with a default fallback
function getOption(options, propName, def) {
  const value = options[propName];
  if (value !== undefined) {
    return value;
  }
  return def;
}
