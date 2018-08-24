import {
  AfterViewInit,
  Component,
  Input
} from '@angular/core';

import {NzModalRef} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {datasetManager} from '../../../core/dataset/dataset.manager';

@Component({
  selector: 'nz-modal-filter',
  templateUrl: './filter.modal.component.html',
  styleUrls: ['./filter.modal.component.less']
})
export class NzModalFilterComponent implements AfterViewInit {
  @Input() title: string;
  @Input() subtitle: string;

  @Input() fieldName: string;

  list = [];

  constructor(private modal: NzModalRef) {

  }

  get listStr() {
    console.log('listStr', this.list);
    return this.list.filter((value) => {
      return !!value.checked;
    }).map((value) => {
      return value.value;
    }).join(',');
  }

  get goodList() {
    return this.list.filter((value) => {
      return !!value.checked;
    }).map((value) => {
      return value.value;
    });
  }

  getFieldValueList(table: Array<{ [key: string]: any }>, fieldName: string) {
    const array = table.map((value, index) => {
      return {
        value: value[fieldName]
      };
    });
    return _.uniqBy(array, 'value');
  }

  destroyModal(): void {
    this.modal.destroy({data: 'this the result data'});
  }

  ngAfterViewInit() {
    console.log(JSON.stringify(datasetManager.current.source),
      this.fieldName,
      JSON.stringify(this.getFieldValueList(datasetManager.current.source, this.fieldName)));
    this.list = this.getFieldValueList(datasetManager.current.source, this.fieldName);
  }
}
