import {
  Component, Input, Output
} from '@angular/core';

@Component({
  selector: 'filter-list',
  templateUrl: './filter.list.component.html',
  styleUrls: ['./filter.list.component.less']
})
export class FilterListComponent {

  listMode = 'list';

  @Input() fieldValueList: Array<any> = [];


  constructor() {
  }

  get list() {
    return this.fieldValueList.filter((value) => {
      return !!value.check;
    }).map((value) => {
      return value.value;
    }).join(',');
  }
}
