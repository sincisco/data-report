import {
  AfterViewInit,
  Component,
  EventEmitter,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {NgForm} from '@angular/forms';
import {datasetManager} from '@core/dataset/dataset.manager';

import {NzModalService} from 'ng-zorro-antd';
import {ConfigModel} from '../graphic.config';

import {removeUndefined} from '../../../../utils/common';
import {debounceTime} from 'rxjs/operators';
import {ChartBarOption} from '@core/node/graphic/chart.graphic/bar.chart.graphic';

@Component({
  selector: 'app-bar-config',
  templateUrl: './bar.config.component.html',
  styleUrls: ['./bar.config.component.less']
})
export class BarConfigComponent extends ConfigModel implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;
  @Output() output = new EventEmitter();

  option: ChartBarOption = {
    title: {
      show: true,
      text: '默认标题',
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
    xAxis: {
      type: 'category',
      nameGap: 10,
      axisLabel: {},
      axisTick: {}
    },
    yAxis: {
      axisLabel: {},
      axisTick: {}
    },
    series: [{
      name: '系列1',
      type: 'bar'
    }]
  };

  private _differ: KeyValueDiffer<any, any>;

  constructor(private modalService: NzModalService, private _differs: KeyValueDiffers) {
    super();
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }

  ngAfterViewInit() {
    this.ngForm.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      console.log('BarConfigComponent  valueChanges', value);
      const changes = this._differ.diff(value);
      if (this.graphic) {
        value.dataset = datasetManager.current;
        this.graphic.update(removeUndefined(value));
      }

      if (this.face) {
        value.dataset = datasetManager.current;
        this.face.update(value);
      }
      if (changes) {
        changes.forEachRemovedItem((record) => {
          console.log('removedItem', JSON.stringify(record.key));
        });
        changes.forEachAddedItem((record) => {
          console.log('addedItem', JSON.stringify(record.key));
        });
        changes.forEachChangedItem((record) => {
          console.log('changedItem', JSON.stringify(record.key));
        });
        console.log('BarConfigComponent  has change');
      }
    });

    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', this.output.subscribe(() => {
    }));
  }


}

