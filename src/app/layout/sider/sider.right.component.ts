import {AfterViewInit, Component, KeyValueDiffer, KeyValueDiffers, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AppBodyComponent} from '../app.body.component';
import {dataModelList} from "../../utils/dataModel";

@Component({
  selector: 'app-sider-right',
  templateUrl: './sider.right.component.html',
  styleUrls: ['./sider.right.component.less']
})
export class SiderRightComponent implements AfterViewInit, OnInit {

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

  modelName = '未选择任何model';

  private _differ: KeyValueDiffer<any, any>;

  constructor(private _differs: KeyValueDiffers, private appBody: AppBodyComponent) {
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }


  ngAfterViewInit() {

  }

  doClick($event: MouseEvent) {
    dataModelList.open($event, (value: string) => {
      this.modelName = value;
    });
  }

}
