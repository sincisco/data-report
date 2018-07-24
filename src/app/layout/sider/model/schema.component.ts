import {AfterViewInit, Component, KeyValueDiffer, KeyValueDiffers, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TableSchema} from '../../../model/table.schema';
import {draggableHeler} from "../../../utils/draggable.helper";

interface Dimension {
  name: string,
  displayName: string,
  type?: 'number' | 'ordinal'
}

type Dimensions = Array<Dimension>;


@Component({
  selector: 'schema-pills',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.less']
})
export class SchemaPillsComponent implements AfterViewInit {
  // schema: TableSchema = new TableSchema(demo);
  dimensions: Dimensions = [
    {
      name: 'product',
      displayName: '产品'
    }, {
      name: '2015',
      displayName: '2015年'
    }, {
      name: '2016',
      displayName: '2016年'
    }, {
      name: '2017',
      displayName: '2017年'
    }
  ];

  constructor() {
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


var demo = [['product', '2015', '2016', '2017', '2018'],
  ['Matcha Latte', 41.1, 30.4, 65.1, 53.3],
  ['Milk Tea', 86.5, 92.1, 85.7, 83.1],
  ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4]];
