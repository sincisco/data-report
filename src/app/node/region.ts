import {INode} from './interface';
import {Report} from "./report";
import {fromEvent} from "rxjs";
import {filter, throttleTime} from "rxjs/internal/operators";

export const reportGlobal: {
  instance: IContent
} = {
  instance: null
};

export function getRegionTemplate(contentArray: Array<string>): string {
  return `
  <div class="node-wrapper">
  ${contentArray.join(" ")}
  <div class="u-mover"  draggable="true"></div>
  </div>
  `;
}

export abstract class Region implements INode {
  protected _report: Report;
  protected _content: IContent;
  $element: JQuery;
  $mover: JQuery;

  protected _coordinates: JQuery.Coordinates;

  constructor(contentArray: Array<string>) {
    this.$element = $(getRegionTemplate(contentArray));
    this.$mover = this.$element.find('.u-mover');
  }

  set report(param: Report) {
    this._report = param;
  }

  get report() {
    return this._report;
  }

  set content(content: IContent) {
    this._content = content;
  }

  get content() {
    return this._content;
  }

  get coordinates(): JQuery.Coordinates {
    return this._coordinates;
  }

  abstract select();

  abstract unselect();

  abstract activate();

  abstract deactivate();

  abstract refresh();

  protected _bindEventForMover() {
    var count = 0, originPageX, originPageY, snapshot: JQuery.Coordinates;
    this.$mover
      .on('dragstart', ($event: JQuery.Event) => {
        count = 0;
        const event: DragEvent = <DragEvent>$event.originalEvent;
        event.dataTransfer.effectAllowed = 'move';
        originPageX = $event.pageX, originPageY = $event.pageY;
        snapshot = Object.assign({}, this._coordinates);
        console.log('mover dragstart:', 'pageX', $event.pageX, 'pageY', $event.pageY);
        $event.stopPropagation();
      }).on('click', ($event) => {
      this.$element.addClass('selected');
      if (this._content) {
        reportGlobal.instance = this._content;
        this._content.activate();
      }
    }).on('dblclick',($event: JQuery.Event)=>{
      this.report.activateRegion(this);
    }).on('dragend', ($event: JQuery.Event) => {
      console.log('mover dragend:', 'pageX', $event.pageX, 'pageY', $event.pageY);
    });

    var moverDrag = fromEvent(this.$mover, 'drag');

    moverDrag.pipe(filter(ev => count++ > 2), throttleTime(100)).subscribe(($event: DragEvent) => {
      console.log('mover drag:', 'pageX', $event.pageX, 'pageY', $event.pageY);
      if ($event.pageX === 0)
        return;
      var offsetLeft = $event.pageX - originPageX,
        offsetTop = $event.pageY - originPageY;
      this.coordinates.left = snapshot.left + Math.round(offsetLeft / this._report.scale);
      this.coordinates.top = snapshot.top + Math.round(offsetTop / this._report.scale);
      this.refresh();

    }); // 事件对象
  }

}

