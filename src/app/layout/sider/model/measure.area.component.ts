import {
  AfterViewInit,
  Component, ElementRef, HostBinding,
  Input, OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import {draggableHeler} from '../../../utils/draggable.helper';
import {DataModel} from '@core/data/data.model.interface';
import {dataModelManager} from '@core/data/data.model.manager';


@Component({
  selector: 'app-measure-area',
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './measure.area.component.html',
  styleUrls: ['./measure.area.component.less']
})
export class MeasureAreaComponent implements AfterViewInit, OnDestroy {
  private _$element: JQuery;
  // schema: TableSchema = new TableSchema(demo);
  dataModel: DataModel;

  @Input() modelName: string;

  @HostBinding('class.measure-area') measureArea = true;

  constructor(private _elementRef: ElementRef) {
    this._$element = $(_elementRef.nativeElement);
    this.dataModel = dataModelManager.getDefaultDataset();
  }

  ngAfterViewInit() {
    dataModelManager.currentDataModelObservable.subscribe((dataModel) => {
      this.dataModel = dataModel;
    });
  }

  doDragStart(event: DragEvent, item) {
    console.log(event);
    console.log((<HTMLElement>event.target).getAttribute('fieldid'));
    event.dataTransfer.setData('Text', (<HTMLElement>event.target).getAttribute('fieldid'));
    draggableHeler.dragInfo = item;
  }

  toggleList(event: MouseEvent) {
    const dataModel = this.dataModel;
    if (dataModel) {
      this.dataModel.state.collapsedMeasure = !this.dataModel.state.collapsedMeasure;
      if (this.dataModel.state.collapsedMeasure) {
        this._$element.find(`li[datamodelname='${this.dataModel.id}']`).hide();
      } else {
        this._$element.find(`li[datamodelname='${this.dataModel.id}']`).show();
      }
    }
  }

  ngOnDestroy() {
    this._elementRef = null;
    this._$element = null;
  }

}

