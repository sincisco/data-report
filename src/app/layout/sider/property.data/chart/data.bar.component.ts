import {AfterViewInit, Component, EventEmitter, KeyValueDiffer, KeyValueDiffers, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IDataComponent} from "../html/header.component";
import {ChartBarItem} from "../../../../node/content/chart/interface";

@Component({
  selector: 'data-bar',
  templateUrl: './data.bar.component.html',
  styleUrls: ['./data.bar.component.less']
})
export class DataBarComponent implements AfterViewInit, OnInit, IDataComponent {

  @ViewChild(NgForm) ngForm: NgForm;
  @Output() output = new EventEmitter();

  option:{
    series:Array<ChartBarItem>
  } = {
    series:[
      {
        type:'bar',
        encode:{
          x:0,
          y:1
        }
      }
    ]
  };

  angle: string;
  private _differ: KeyValueDiffer<any, any>;

  constructor(private _differs: KeyValueDiffers) {
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }

  dragenter(event: DragEvent){
    // 阻止浏览器默认事件
    event.preventDefault();
  }

  dragover(event: DragEvent){
      // 阻止浏览器默认事件
      event.preventDefault();
  }

  dropX(event: DragEvent) {
    event.preventDefault();
    var data = event.dataTransfer.getData('Text');
    console.log(data);
  }

  dropY(event: DragEvent) {
    event.preventDefault();
    var data = event.dataTransfer.getData('Text');
    this.option.series[0].encode.y=data;
    this.output.emit(this.option);
    console.log(data);
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
