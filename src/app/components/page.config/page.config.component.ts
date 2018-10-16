import {AfterViewInit, Component, EventEmitter, KeyValueDiffer, KeyValueDiffers, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {PageConfig} from './page.config';
import {debounceTime} from 'rxjs/operators';
import {ChangedItem} from '@core/node/event/model.event';

@Component({
  selector: 'app-page-config',
  templateUrl: './page.config.component.html',
  styleUrls: ['./page.config.component.less']
})
export class PageConfigComponent extends PageConfig implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;
  @Output() output = new EventEmitter();

  private _differ: KeyValueDiffer<any, any>;

  option = {
    text: '页面标题',
    auxiliaryLine: false,
    dimensionMode: 'standard',
    width: 960,
    height: 720,
    backgroundMode: 'built-in',
    backgroundColor: 'rgb(255,255,255)',
    backgroundClass: 'background1',
    backgroundCustom: {
      fileName: '',
      url: '',
      dataUrl: ''
    },
    themeMode: 'dark'
  };

  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };

  formatterWidth = value => `宽度 ${value}`;
  parserWidth = value => value.replace('宽度 ', '');
  formatterHeight = value => `高度 ${value}`;
  parserHeight = value => value.replace('高度 ', '');

  constructor(private _differs: KeyValueDiffers) {
    super();
  }

  get width() {
    return this.option.width;
  }

  get height() {
    return this.option.height;
  }

  dimensionModeChange(value) {
    switch (value) {
      case 'standard':
        this.option.width = 960;
        this.option.height = 720;
        break;
      case 'wide':
        this.option.width = 960;
        this.option.height = 540;
        break;
      case 'mobile':
        this.option.width = 380;
        this.option.height = 680;
        break;
      case 'custom':
        break;
    }
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }


  ngAfterViewInit() {
    console.log('PageConfigComponent ngAfterViewInit');
    this.ngForm.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      console.log('PageConfigComponent', value);
      const array = [];
      const changes = this._differ.diff(value);
      if (changes) {
        changes.forEachRemovedItem((record) => {
          console.log('removedItem', JSON.stringify(record.key));
          array.push({
            key: `remove.${record.key}`,
            oldValue: record.previousValue,
            newValue: record.currentValue,
            option: value
          });
        });
        changes.forEachAddedItem((record) => {
          array.push({
            key: `add.${record.key}`,
            oldValue: record.previousValue,
            newValue: record.currentValue,
            option: value
          });
          console.log('addedItem', JSON.stringify(record.key));
        });
        changes.forEachChangedItem((record) => {
          console.log('changedItem', JSON.stringify(record.key));
          array.push({
            key: record.key,
            oldValue: record.previousValue,
            newValue: record.currentValue,
            option: value
          });
        });
      }
      if (array.length > 0) {
        console.log('do page update');
        this._update(array);
      }
    });
  }

  private _update(changeItemArray: Array<ChangedItem>) {
    changeItemArray.forEach((value, index, array) => {
      this._trigger(value);
    });
  }

}

