import {AfterViewInit, Component, KeyValueDiffer, KeyValueDiffers, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AppBodyComponent} from '../app.body.component';
import {dataModelList} from '../../utils/dataModel';
import {datasetManager} from '@core/dataset/dataset.manager';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-sider-right',
  encapsulation: ViewEncapsulation.None,
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

  constructor(private _differs: KeyValueDiffers, private appBody: AppBodyComponent, private http: HttpClient) {
    this.modelName = datasetManager.getDefaultDataset().displayName;
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }


  ngAfterViewInit() {
    console.log('http://10.2.78.207:8080/table/total');
    this.http.get('http://10.2.78.207:8080/table/total')
      .subscribe((data: any) => console.log(data));

    //, {
    //       headers: new HttpHeaders({'Content-Type': 'application/json'}),
    //       withCredentials: true
    //     }
    this.http.post('http://10.2.78.207:8080/table/query', {tableName: 'alumni_list'})
      .subscribe((data: any) => {
        console.log(data);
        let dimensions = data.data.dimensions;
        dimensions = dimensions.map((value) => {
          value.type = value.type === 'INT' ? 'int' : 'ordinal';
          return value;
        });

        datasetManager.addDataset(data.data.id, '中国大学杰出校友排行榜', {
          dimensions,
          source: data.data.source
        });

        console.log(dimensions);
      });
    this.http.post('http://10.2.78.207:8080/table/query', {tableName: 'young_people_list'})
      .subscribe((data: any) => {
        console.log(data);
        let dimensions = data.data.dimensions;
        dimensions = dimensions.map((value) => {
          value.type = value.type === 'INT' ? 'int' : 'ordinal';
          return value;
        });

        datasetManager.addDataset(data.data.id, '各大学国家杰出青年入选数量', {
          dimensions,
          source: data.data.source
        });

        console.log(dimensions);
      });




  }

  doClick($event: MouseEvent) {
    dataModelList.open($event, (value: string) => {
      this.modelName = value;
    });
  }

}
