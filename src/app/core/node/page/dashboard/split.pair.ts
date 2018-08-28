import {SplitGutter} from '@core/node/page/dashboard/split.gutter';
import {SplitArea} from '@core/node/page/dashboard/split.area';
import {getBoundingClientRect} from '@core/node/page/dashboard/dashboard.canvas';
import {Split} from '@core/node/page/dashboard/split';


export class SplitPair {
  private _dragging = false;

  private _move;
  private _stop;

  private _size;
  private _start;

  private _gutter: SplitGutter;
  private _area: SplitArea;

  private _nextPair: SplitPair;

  constructor(private _parent: Split, private  _previous: SplitPair, areaSize: string | number, minAreaSize: any) {
    const
      _gutter = new SplitGutter(_parent),
      _area = new SplitArea(_parent, areaSize, minAreaSize);
    _gutter.splitPair = this;
    _area.splitPair = this;

    this._gutter = _gutter;
    this._area = _area;

    _gutter.subscribeMousedown(this._startDragging.bind(this));
  }

  get splitArea() {
    return this._area;
  }

  resize() {
    if (this._area) {
      this._area.resize();
    }
  }

  render() {
    return this._area.render();
  }

  // For first and last pairs, first and last gutter width is half.
  public get aGutterSize() {
    if (this.isFirst) {
      return this._parent.gutterSize / 2;
    } else {
      return this._parent.gutterSize;
    }
  }

  public get bGutterSize() {
    if (this.isLast) {
      return this._parent.gutterSize / 2;
    } else {
      return this._parent.gutterSize;
    }
  }

  public refresh(gutterState: boolean, areaState: boolean) {
    this._gutter.activeState = gutterState;
    this._area.activeState = areaState;
  }

  set order(order: number) {
    if (this._gutter) {
      (this._gutter.order = '' + order);
    }
    this._area.order = (++order) + '';
  }

  public directionChange() {
    if (this._gutter) {
      this._gutter.directionChange();
    }
    this._area.directionChange();
  }

  public get isHead(): boolean {
    return this === this._parent.headPair;
  }

  public get isFirst(): boolean {
    return this === this.parent.headPair.nextPair;
  }

  public get isLast(): boolean {
    return this === this.parent.tailPair;
  }

  public set previousPair(value) {
    this._previous = value;
  }

  public get previousPair() {
    return this._previous;
  }

  public get nextPair() {
    return this._nextPair;
  }

  public set nextPair(value: SplitPair) {
    this._nextPair = value;
  }

  public dragInsertBefore(sourcePair: SplitPair) {
    const previous = sourcePair.previousPair,
      next = sourcePair.nextPair;
    if (previous) {
      previous.nextPair = next;
    }
    if (next) {
      next.previousPair = previous;
    }
    if (sourcePair.isHead) {
      this._parent.headPair = next;
    }
    if (sourcePair.isLast) {
      this._parent.tailPair = previous;
    }
    sourcePair.previousPair = null;
    sourcePair.nextPair = null;

    if (this.isHead) {
      sourcePair.previousPair = this._previous;

      this._previous = sourcePair;
      sourcePair.nextPair = this;
      this.parent.headPair = sourcePair;
    } else {
      sourcePair.previousPair = this._previous;
      sourcePair.nextPair = this;
      this._previous.nextPair = sourcePair;
      this._previous = sourcePair;
    }
    console.log('dragInsertBefore end1');
    this.parent.refresh();
    console.log('dragInsertBefore end2');
  }

  public insertBefore() {
    // Create the area object.
    const parent = this._parent,
      previous = this._previous;

    // Create the pair object with its metadata.
    const insertedPair: SplitPair = new SplitPair(parent, previous, 10, 100),
      splitArea = insertedPair.splitArea;

    if (this.isHead) {
      insertedPair.nextPair = this;
      this._previous = insertedPair;

      this.parent.headPair = insertedPair;
    } else {
      previous.nextPair = insertedPair;
      this._previous = insertedPair;

      insertedPair.nextPair = this;
    }


    // Set the element size to our determined size.
    // Half-size gutters for first and last elements.
    if (insertedPair.isLast || insertedPair.isHead) {
      splitArea.size = 10;
      // splitArea.setElementSize(10, this.parent.gutterSize / 2);
    } else {
      splitArea.size = 10;
      // splitArea.setElementSize(10, this.parent.gutterSize);
    }

    const computedSize = splitArea.element[getBoundingClientRect]()[this.parent.dimension];

    if (computedSize < splitArea.minSize) {
      splitArea.minSize = computedSize;
    }

    this.parent.refresh();
  }

  public insertAfter() {
    // Create the area object.
    const parent = this._parent,
      next = this._nextPair;

    // Create the pair object with its metadata.
    const insertedPair: SplitPair = new SplitPair(parent, this, 10, 100),
      splitArea = insertedPair.splitArea;

    if (this.isLast) {
      this._nextPair = insertedPair;

      this.parent.tailPair = insertedPair;
    } else {
      this._nextPair = insertedPair;
      next.previousPair = insertedPair;

      insertedPair.nextPair = next;
    }


    // Set the element size to our determined size.
    // Half-size gutters for first and last elements.
    if (insertedPair.isLast || insertedPair.isHead) {
      splitArea.size = 10;
      // splitArea.setElementSize(10, this.parent.gutterSize / 2);
    } else {
      splitArea.size = 10;
      // splitArea.setElementSize(10, this.parent.gutterSize);
    }

    const computedSize = splitArea.element[getBoundingClientRect]()[this.parent.dimension];

    if (computedSize < splitArea.minSize) {
      splitArea.minSize = computedSize;
    }

    this.parent.refresh();
  }

  public remove(deleteArea?: boolean) {
    if (this.isHead) {
      if (!this.isLast) {
        this._parent.headPair = this._nextPair;
        this._nextPair.previousPair = null;
        this._destroy();
      } else {
        if (deleteArea) {
          alert('split 至少有一个area，请删除Split！');
        } else {
          this._parent.headPair = this._parent.tailPair = null;
          this._destroy();
        }

      }
    } else {
      if (this.isLast) {
        this._parent.tailPair = this._previous;
        this._previous.nextPair = null;
        this._destroy();
      } else {
        const next = this._nextPair,
          previous = this._previous;
        previous.nextPair = next;
        next.previousPair = previous;
        this._destroy();
      }

    }
    this.parent.refresh();
  }

  private _destroy() {
    this._gutter.destroy();
    this._area.destroy();
  }

  get area(): SplitArea {
    return this._area;
  }

  get frontResizableArea(): SplitArea {
    if (this._area.resizable) {
      return this._area;
    } else if (this.previousPair) {
      return this.previousPair.backResizableArea;
    }
  }

  get backResizableArea(): SplitArea {
    if (this._area.resizable) {
      return this._area;
    } else if (this.nextPair) {
      return this.nextPair.backResizableArea;
    }
  }

  set start(value) {
    this._start = value;
  }

  get start() {
    return this._start;
  }

  set sizePx(value) {
    this._size = value;
  }

  get sizePx() {
    return this._size;
  }

  get parent() {
    return this._parent;
  }

  // startDragging calls `calculateSizes` to store the inital size in the pair object.
  // It also adds event listeners for mouse/touch events,
  // and prevents selection while dragging so avoid the selecting text.
  private _startDragging(startEvent) {
    console.log('start drag');
    const split: Split = this.parent;
    // Call the onDragStart callback.
    if (!this._dragging) {
      // 调用用户的回调函数
      this._parent.onDragStart();
    }

    // Alias frequently used variables to save space. 200 bytes.
    const frontArea = this._previous.frontResizableArea,
      backArea = this.backResizableArea;

    if (!frontArea || !backArea) {
      return false;
    }

    // Don't actually drag the element. We emulate that in the drag function.
    startEvent.preventDefault();

    // Set the dragging property of the pair object.
    this._dragging = true;

    // Create two event listeners bound to the same pair object and store
    // them in the pair object.

    // drag, where all the magic happens. The logic is really quite simple:
    //
    // 1. Ignore if the pair is not dragging.
    // 2. Get the offset of the event.
    // 3. Snap offset to min if within snappable range (within min + snapOffset).
    // 4. Actually adjust each element in the pair to offset.
    //
    // ---------------------------------------------------------------------
    // |    | <- a.minSize               ||              b.minSize -> |    |
    // |    |  | <- this.snapOffset      ||     this.snapOffset -> |  |    |
    // |    |  |                         ||                        |  |    |
    // |    |  |                         ||                        |  |    |
    // ---------------------------------------------------------------------
    // | <- this.start                                        this.size -> |
    this._move = (event) => {
      // console.log('mouse move');
      let offset;

      if (!this._dragging) {
        return;
      }

      // Get the offset of the event from the first side of the
      // pair `this.start`. Supports touch events, but not multitouch, so only the first
      // finger `touches[0]` is counted.
      if ('touches' in event) {
        offset = event.touches[0][this._parent.ClientAxis] - this.start;
      } else {
        offset = event[this._parent.ClientAxis] - this.start;
      }
      offset += this._previousWidth;
      // console.log(event, '****', offset);

      // If within snapOffset of min or max, set offset to min or max.
      // snapOffset buffers a.minSize and b.minSize, so logic is opposite for both.
      // Include the appropriate gutter sizes to prevent overflows.
      if (offset <= frontArea.minSize + this._parent.snapOffset + this.aGutterSize) {
        offset = frontArea.minSize + this.aGutterSize;
      } else if (offset >= this.sizePx - (backArea.minSize + this._parent.snapOffset + this.bGutterSize)) {
        offset = this.sizePx - (backArea.minSize + this.bGutterSize);
      }

      // Actually adjust the size.
      this._adjust(offset, frontArea, backArea);

      // Call the drag callback continously. Don't do anything too intensive
      // in this callback.
      this._parent.onDrag();
    };

    // stopDragging is very similar to startDragging in reverse.
    this._stop = (event) => {
      if (this._dragging) {
        this._parent.onDragEnd();
      }

      this._dragging = false;

      // Remove the stored event listeners. This is why we store them.
      document.removeEventListener('mouseup', this._stop);
      split.element.removeEventListener('mousemove', this._move);

      // Clear bound function references
      this._stop = null;
      this._move = null;

      frontArea.recoverSelection();
      backArea.recoverSelection();

      this._gutter.element.style.cursor = '';
      this._parent.element.style.cursor = '';
      document.body.style.cursor = '';
      frontArea.resize();
      backArea.resize();
    };

    // All the binding. `window` gets the stop events in case we drag out of the elements.
    document.addEventListener('mouseup', this._stop);
    split.element.addEventListener('mousemove', this._move);

    // Disable selection. Disable!
    frontArea.disableSelection();
    backArea.disableSelection();

    // Set the cursor at multiple levels
    this._gutter.element.style.cursor = this.parent.cursor;
    this._parent.element.style.cursor = this.parent.cursor;
    document.body.style.cursor = this.parent.cursor;

    // Cache the initial sizes of the pair.
    this._calculateSizes(frontArea, backArea);
    this.start = startEvent[this._parent.ClientAxis];
  }

  // Actually adjust the size of elements `a` and `b` to `offset` while dragging.
  // calc is used to allow calc(percentage + gutterpx) on the whole split instance,
  // which allows the viewport to be resized without additional logic.
  // Element a's size is the same as offset. b's size is total size - a size.
  // Both sizes are calculated from the initial parent percentage,
  // then the gutter size is subtracted.
  private _adjust(offset, frontArea: SplitArea, backArea: SplitArea) {
    const percentage = <number>frontArea.size + <number>backArea.size;

    frontArea.size = Math.round((offset / this.sizePx) * percentage);
    backArea.size = (percentage - frontArea.size);

    // frontArea.setElementSize(frontArea.size, this.aGutterSize);
    // backArea.setElementSize(backArea.size, this.aGutterSize);
  }

  private _previousWidth: number;

  // Cache some important sizes when drag starts, so we don't have to do that
  // continously:
  //
  // `size`: The total size of the pair. First + second + first gutter + second gutter.
  // `start`: The leading side of the first element.
  //
  // ------------------------------------------------
  // |      aGutterSize -> |||                      |
  // |                     |||                      |
  // |                     |||                      |
  // |                     ||| <- bGutterSize       |
  // ------------------------------------------------
  // | <- start                             size -> |
  private _calculateSizes(frontArea: SplitArea, backArea: SplitArea) {
    const parent = this._parent;
    // Figure out the parent size minus padding.
    const a = frontArea.element;
    const b = backArea.element;

    const aBounds = a[getBoundingClientRect]();
    const bBounds = b[getBoundingClientRect]();

    this.sizePx = aBounds[parent.dimension] + bBounds[parent.dimension] /*+ this.aGutterSize + this.bGutterSize*/;
    this._previousWidth = aBounds[parent.dimension];
    // this.start = aBounds[parent.position];
  }

  startAnimation() {
    this._area.startAnimation();
  }

  stopAnimation() {
    this._area.stopAnimation();
  }
}
