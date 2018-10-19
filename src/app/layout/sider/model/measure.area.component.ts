import {
  AfterViewInit,
  Component, ElementRef, HostBinding,
  Input, OnChanges, OnDestroy,
  SimpleChanges,
  ViewChild,
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
export class MeasureAreaComponent implements AfterViewInit, OnChanges, OnDestroy {
  private _$element: JQuery;
  // schema: TableSchema = new TableSchema(demo);
  dataModel: DataModel;

  @Input() modelName: string;

  @HostBinding('class.measure-area') measureArea = true;

  constructor(private _elementRef: ElementRef) {
    this._$element = $(_elementRef.nativeElement);
    this.dataModel = dataModelManager.getDefaultDataset();
  }


  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      console.log('hhaahahahahhahah', prev, cur);
      if (dataModelManager.getDataModel(chng.currentValue)) {
        this.dataModel = dataModelManager.getDataModel(chng.currentValue);
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

