import {AfterViewInit, Component, KeyValueDiffer, KeyValueDiffers, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AppBodyComponent} from '../../../app.body.component';
import {GraphicConfig} from '../graphic.config';

@Component({
  selector: 'app-pie-config',
  templateUrl: './pie.config.component.html',
  styleUrls: ['./pie.config.component.less']
})
export class PieConfigComponent extends GraphicConfig implements AfterViewInit, OnInit {

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
    super();
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.ngForm.valueChanges.subscribe((value) => {
        console.log(value);
        console.log(this.option);
        const changes = this._differ.diff(value);
        if (changes) {
          console.log('has change');
          if (this.appBody.chart) {
            this.appBody.chart.setOption(value);
          }
        }

      });
    }, 10);

  }

}
