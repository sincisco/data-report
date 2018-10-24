import {
  AfterViewInit,
  Component, DoCheck,
  EventEmitter,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {NgForm} from '@angular/forms';

import {dataModelManager} from '../../../core/data/data.model.manager';

import {NzModalService} from 'ng-zorro-antd';
import {Dimension} from '../../../core/data/data.model.interface';
import {DesignGraphicConfig} from '../../../core/source/config.source/design.config.source';
import {ChartPieConfig} from '../../../core/node/graphic/chart/pie.chart.graphic';
import {debounceTime} from 'rxjs/operators';
import {removeUndefined} from '../../../utils/common';

@Component({
  selector: 'app-pie-config',
  templateUrl: './pie.config.component.html',
  styleUrls: ['./pie.config.component.less']
})
export class PieConfigComponent extends DesignGraphicConfig implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;
  @ViewChild('modalTitle') tplTitle: TemplateRef<any>;
  @Output() output = new EventEmitter();

  option: ChartPieConfig = {
    title: {
      show: true,
      text: '我是一个大标题',
      left: 'auto',
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      backgroundColor: 'transparent',
      textStyle: {
        align: 'left'
      }
    },
    grid: {
      show: false,
      borderColor: '#ccc',
      backgroundColor: 'transparent',
      left: '10%',
      right: '10%',
      top: 60,
      bottom: 60
    },
    series: [{
      name: '系列1',
      type: 'pie'
    }]
  };

  seriesX: Array<Dimension> = [];
  seriesY: Array<Dimension> = [];
  private _differ: KeyValueDiffer<any, any>;

  private _innerOption;

  constructor(private modalService: NzModalService, private _differs: KeyValueDiffers) {
    super();
  }

  ngAxisChange($event) {
    console.log(JSON.stringify($event));
    this._updateSeries();
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }

  private _updateSeries() {
    if (this.seriesX.length === 0 || this.seriesY.length === 0) {
      return;
    }
    this.option.series = [];
    // this.option.dataset = Object.assign({},
    //   datasetManager.current,
    //   {source: filterExecutor.execute(datasetManager.current.source, this.filterArray)});
    // this.option.dataset = datasetManager.current;
    this.option.series.push({
      type: 'pie',
      name: 'test'
    });
    this.output.emit(this.option);
  }

  ngAfterViewInit() {
    this.ngForm.valueChanges.pipe(debounceTime(100)).subscribe((value) => {
      console.log('PieConfigComponent  valueChanges');
      // value.dataset = dataModelManager.current;
      value = removeUndefined(value);
      this._trigger({
        key: 'option',
        oldValue: this._innerOption,
        newValue: value,
        option: value
      });
      this._innerOption = value;

      // if (this.face) {
      //   value.dataset = datasetManager.current;
      //   this.face.update(value);
      // }
    });
  }
}

