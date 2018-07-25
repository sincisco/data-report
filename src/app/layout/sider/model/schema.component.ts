import {AfterViewInit, Component, Input, KeyValueDiffer, KeyValueDiffers, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TableSchema} from '../../../model/table.schema';
import {draggableHeler} from '../../../utils/draggable.helper';
import {DataSet} from "../../../adapter/groupBy";
import {DatasetWrapper} from "@core/dataset.interface";
import {datasetManager} from "@core/dataset.manager";


interface Dimension {
  name: string,
  displayName: string,
  type?: 'number' | 'ordinal'
}

type Dimensions = Array<Dimension | string>;


@Component({
  selector: 'schema-pills',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.less']
})
export class SchemaPillsComponent implements AfterViewInit {
  // schema: TableSchema = new TableSchema(demo);
  dimensions: Dimensions = [
    {
      name: '学校',
      displayName: '学校'
    }, {
      name: '省份',
      displayName: '省份'
    }, {
      name: '城市',
      displayName: '城市'
    }, {
      name: '本科毕业生人数',
      displayName: '本科毕业生人数'
    }, {
      name: '硕士毕业生人数',
      displayName: '硕士毕业生人数'
    }, {
      name: '博士毕业生人数',
      displayName: '博士毕业生人数'
    }, {
      name: '毕业生人数',
      displayName: '毕业生人数'
    }
  ];
  datasetWrapper: DatasetWrapper;

  constructor() {
  }

  @Input() modelName: string;

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
    document.getElementById('dragImg').addEventListener('dragstart', function (event: DragEvent) {
      // 存储拖拽数据和拖拽效果...
      console.log(event);
      console.log((<HTMLElement>event.target).getAttribute('fieldid'));
      event.dataTransfer.setData('Text', (<HTMLElement>event.target).getAttribute('fieldid'));
    }, false);
  }

  doDragStart(event: DragEvent, item) {
    console.log(event);
    console.log((<HTMLElement>event.target).getAttribute('fieldid'));
    event.dataTransfer.setData('Text', (<HTMLElement>event.target).getAttribute('fieldid'));
    draggableHeler.dragInfo = item;
  }
}

