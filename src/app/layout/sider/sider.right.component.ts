import {AfterViewInit, Component, KeyValueDiffer, KeyValueDiffers, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgForm} from '@angular/forms';
import {DesignerBodyComponent} from '../designer.body.component';
import {dataModelList} from '../../utils/dataModel';
import {dataModelManager} from '@core/data/data.model.manager';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {array} from '@core/data/test';
import {DataOptionSet} from '@core/data/data.option.set';
import {DataOptionManager} from '@core/data/data.option.manager';

export let modelPlugin = null;


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

  modelID: string;
  modelName: string;

  private _differ: KeyValueDiffer<any, any>;

  constructor(private _differs: KeyValueDiffers, private appBody: DesignerBodyComponent, private http: HttpClient) {
    // this.modelName = dataModelManager.getDefaultDataset().displayName;
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }

  closeRightPanel() {
    this.appBody.closeRightPanel();
  }


  ngAfterViewInit() {

    DataOptionManager.getInstance().addDataOptionSet('space1', new DataOptionSet(array));

    dataModelManager.dataOptionSet = DataOptionManager.getInstance().getDataOptionSet('space1');

    modelPlugin = this;

    dataModelManager.modelNameObservable.subscribe((modelName) => {
      console.log('modelName Changed');
      this.modelName = modelName;
    });
    /*
        this.http.get('http://10.2.78.207:8080/table/total')
          .subscribe((data: any) => console.log(data));

        // , {
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

            dataModelManager.addDataset(data.data.id, '中国大学杰出校友排行榜', {
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

            dataModelManager.addDataset(data.data.id, '各大学国家杰出青年入选数量', {
              dimensions,
              source: data.data.source
            });

            console.log(dimensions);
          });

    */

  }

  /**
   * 切换当前激活Graphic组件的数据源
   * @param {MouseEvent} $event
   */
  switchDataModel($event: MouseEvent) {
    dataModelList.open($event, (modelID: string) => {
      dataModelManager.switchDataModel(this.modelID = modelID);
    });
  }

}
