import {AfterViewInit, Component, KeyValueDiffer, KeyValueDiffers, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AppBodyComponent} from '../../app.body.component';

@Component({
  selector: 'data-pie',
  templateUrl: './data.pie.component.html',
  styleUrls: ['./data.pie.component.less']
})
export class DataPieComponent implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;

  option = {
    title: {
      show: true,
      text: '大水牛',
      left: 'auto',
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      backgroundColor: '#fff',
      textStyle: {
        align: 'left'
      }
    }
  };

  angle: string;
  private _differ: KeyValueDiffer<any, any>;

  constructor(private _differs: KeyValueDiffers, private appBody: AppBodyComponent) {
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }


  ngAfterViewInit() {
    console.log(this.ngForm);
    this.ngForm.valueChanges.subscribe((value) => {
      console.log(value);
      console.log(this.option);
      const changes = this._differ.diff(value);
      if (changes) {
        console.log('has change');
        if (this.appBody.chart) {
          this.appBody.chart.setOption(value);
        }
        //this._applyChanges(changes);
      }

    });

    var that = this;


    document.getElementById('q123').addEventListener('dragenter', function (event) {
      // 阻止浏览器默认事件
      event.preventDefault();
    }, false);
    document.getElementById('q123').addEventListener('dragover', function (event) {
      // 阻止浏览器默认事件
      event.preventDefault();
    }, false);
    document.getElementById('q123').addEventListener('drop', function (event: DragEvent) {
      event.preventDefault();
      var data = event.dataTransfer.getData('Text');
      that.appBody.chart.setOption({
        series: [
          {
            type: 'pie',
            encode: {
              itemName: 'product',
              value: data
            }
          }
        ]
      });
      that.angle=data;
      console.log({
        series: [
          {
            type: 'pie',
            encode: {
              itemName: 'product',
              value: data
            }
          }
        ]
      });
      //(<Node>event.target).appendChild(document.getElementById(data));
    }, false);

  }

}
