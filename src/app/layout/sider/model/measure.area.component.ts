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
import {DatasetWrapper} from '@core/dataset/dataset.interface';
import {datasetManager} from '@core/dataset/dataset.manager';


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
    this.datasetWrapper = datasetManager.getDefaultDataset();
  }


  @Input() modelName: string;

  @HostBinding('class.measure-area') measureArea = true;

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      console.log('hhaahahahahhahah', prev, cur);
      if (datasetManager.getDataset(chng.currentValue)) {
        this.datasetWrapper = datasetManager.getDataset(chng.currentValue);
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

  tableClick($event: MouseEvent, tableType: string) {
    console.log($event);
    const $target = $($event.target);
    if ($target.data('switch') === 'true') {
      $target.find('i').addClass('u-icn-angle-right').removeClass('u-icn-angle-right');
      $target.data('switch', 'false');
    } else {
      $target.find('i').removeClass('u-icn-angle-right').addClass('u-icn-angle-right');
      $target.data('switch', 'true');
    }
    this._$element.find(`li[datasetname='${this.datasetWrapper.name}']`).toggle();
  }

  ngOnDestroy() {
    this._elementRef = null;
    this._$element = null;
  }

}

