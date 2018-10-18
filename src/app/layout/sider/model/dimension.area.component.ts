import {
  AfterViewInit,
  Component, ElementRef, HostBinding,
  Input,
  KeyValueDiffer,
  KeyValueDiffers, OnChanges, OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {draggableHeler} from '../../../utils/draggable.helper';
import {DatasetWrapper} from '@core/data/data.model.interface';
import {dataModelManager} from '@core/data/data.model.manager';
import {fromEvent} from 'rxjs';


@Component({
  selector: 'app-dimension-area',
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './dimension.area.component.html',
  styleUrls: ['./dimension.area.component.less']
})
export class DimensionAreaComponent implements AfterViewInit, OnChanges, OnDestroy {
  private _$element: JQuery;
  // schema: TableSchema = new TableSchema(demo);
  datasetWrapper: DatasetWrapper;

  constructor(private _elementRef: ElementRef) {
    this._$element = $(_elementRef.nativeElement);
    this.datasetWrapper = dataModelManager.getDefaultDataset();
  }


  @Input() modelName: string;

  @HostBinding('class.dimension-area') dimensionArea = true;

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      if (propName === 'modelName' && dataModelManager.getDataset(chng.currentValue)) {
        this.datasetWrapper = dataModelManager.getDataset(chng.currentValue);
      }
    }
  }

  ngAfterViewInit() {
  }

  doDragStart(event: DragEvent, item) {
    console.log(event);
    console.log((<HTMLElement>event.target).getAttribute('fieldid'));
    event.dataTransfer.setData('Text', (<HTMLElement>event.target).getAttribute('fieldid'));
    draggableHeler.dragInfo = item;
  }

  dragStartForDragBar(event: DragEvent) {

    const subscription = fromEvent(document, 'mousemove')
    /*.pipe(throttleTime(30))*/
      .subscribe((mouseEvent: MouseEvent) => {
        console.log(this._$element.offset());
        console.log(mouseEvent.pageX, mouseEvent.pageY);
        this._$element.height(Math.max(36, mouseEvent.pageY - this._$element.offset().top));
      });
    const mouseupHandler = () => {
      subscription.unsubscribe();
      document.removeEventListener('mouseup', mouseupHandler);
    };
    document.addEventListener('mouseup', mouseupHandler);
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  tableClick(event: MouseEvent) {
    this.datasetWrapper.state.collapsedDimension = !this.datasetWrapper.state.collapsedDimension;
    if (this.datasetWrapper.state.collapsedDimension) {
      this._$element.find(`li[datasetname='${this.datasetWrapper.name}']`).hide();
    } else {
      this._$element.find(`li[datasetname='${this.datasetWrapper.name}']`).show();
    }
  }

  ngOnDestroy() {
    this._elementRef = null;
    this._$element = null;
  }

}

