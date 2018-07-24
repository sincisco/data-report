import {AfterViewInit, Component, EventEmitter, KeyValueDiffer, KeyValueDiffers, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IDataComponent} from "../html/header.component";
import {ChartBarItem} from "../../../../node/content/chart/interface";
import {draggableHeler} from "../../../../utils/draggable.helper";
import {ChartBarOption} from "../../../../node/content/chart/chart.bar";

@Component({
  selector: 'data-bar',
  templateUrl: './data.bar.component.html',
  styleUrls: ['./data.bar.component.less']
})
export class DataBarComponent implements AfterViewInit, OnInit, IDataComponent {

  @ViewChild(NgForm) ngForm: NgForm;
  @Output() output = new EventEmitter();

  option: ChartBarOption = {
    xAxis:{

    },
    series: [
      {
        type: 'bar',
        name: 'test1',
        encode: {
          x: 'product',
          y: 1
        }
      }
    ]
  };

  seriesY: Array<any> = [];

  angle: string;
  private _differ: KeyValueDiffer<any, any>;

  constructor(private _differs: KeyValueDiffers) {
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }

  dragenter(event: DragEvent) {
    event.dataTransfer.dropEffect="move";
    // 阻止浏览器默认事件
    event.preventDefault();
  }

  /**
   * 在其它的事件(如ondragover、ondragleave等），是无法获取dataTransfer里面的值了。
   * 这是由于W3C要求对dataTransfer里的值进行保护[参考]。
   * 因此，如果需要在这些事件里获取数据，只能通过一个全局变量等其它方式来实现了。
   * @param {DragEvent} event
   */
  dragover(event: DragEvent) {
    // 阻止浏览器默认事件
    event.preventDefault();
  }

  dropX(event: DragEvent) {
    event.preventDefault();
    var data = event.dataTransfer.getData('Text');
    console.log(data);
  }

  dropY(event: DragEvent) {
    //火狐中取消drop默认行为，阻止打开URL
    event.preventDefault();

    var data = event.dataTransfer.getData('Text');
    this.seriesY.push(draggableHeler.dragInfo);
    this._updateSeries();
  }

  private _updateSeries(){
    this.option.series=[];
    this.seriesY.forEach((value,index)=>{
      this.option.series.push({
        type: 'bar',
        name: 'test'+index,
        encode: {
          x: 'product',
          y: value.name
        }
      })
    })
    this.output.emit(this.option);
  }



  ngAfterViewInit() {
    console.log(this.ngForm);
    this.ngForm.valueChanges.subscribe((value) => {
      console.log(value);
      console.log(this.option);
      const changes = this._differ.diff(value);
      if (changes) {
        console.log('has change');
        //this._applyChanges(changes);
      }

    });

    var that = this;

  }

}
