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
import {NgForm} from '@angular/forms';
import {TableSchema} from '../../../core/model/table.schema';
import {draggableHeler} from '../../../utils/draggable.helper';
import {DataSet} from '../../../core/adapter/groupBy';
import {DatasetWrapper} from '@core/data/data.model.interface';
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
  datasetWrapper: DatasetWrapper;

  constructor(private _elementRef: ElementRef) {
    this._$element = $(_elementRef.nativeElement);
    this.datasetWrapper = dataModelManager.getDefaultDataset();
  }


  @Input() modelName: string;

  @HostBinding('class.measure-area') measureArea = true;

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      console.log('hhaahahahahhahah', prev, cur);
      if (dataModelManager.getDataset(chng.currentValue)) {
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

  tableClick(event: MouseEvent) {
    this.datasetWrapper.state.collapsedMeasure = !this.datasetWrapper.state.collapsedMeasure;
    if (this.datasetWrapper.state.collapsedMeasure) {
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

