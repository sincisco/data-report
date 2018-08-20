import {AfterViewInit, Component, EventEmitter, KeyValueDiffer, KeyValueDiffers, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {PageConfig} from './page.config';


@Component({
  selector: 'app-page-config',
  templateUrl: './page.config.component.html',
  styleUrls: ['./page.config.component.less']
})
export class PageConfigComponent extends PageConfig implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;

  @Output() output = new EventEmitter();

  option = {
    text: '我是标题',
    auxiliaryLine: true,
    dimensionMode: 'standard',
    width: 960,
    height: 720,
    backgroundMode: 'built-in',
    backgroundColor: 'transparent',
    backgroundClass: 'background1',
    fileName: '',
    backgroundUrl: '',
    backgroundDataUrl: '',
    themeMode: 'dark'
  };

  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };

  private _differ: KeyValueDiffer<any, any>;

  formatterWidth = value => `宽度 ${value}`;
  parserWidth = value => value.replace('宽度 ', '');
  formatterHeight = value => `高度 ${value}`;
  parserHeight = value => value.replace('高度 ', '');

  constructor(private _differs: KeyValueDiffers) {
    super();
  }

  buildInClick(value) {
    this.option.backgroundClass = value;
    this.page.update(this.option);
    console.log(this.option);
  }

  dimensionModeChange(value) {
    console.log(value);
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

    this.page.update(this.option);
  }

  change(event: Event) {
    const file: HTMLInputElement = <HTMLInputElement>event.currentTarget;
    if (!file.files || !file.files[0]) {
      return;
    }
    this.option.fileName = file.files[0].name;
    const that = this;
    const reader = new FileReader();
    reader.onload = (evt) => {
      this.option.backgroundDataUrl = (<any>evt.target).result;
      const image = new Image();
      image.src = (<any>evt.target).result;
      image.onload = function () {
        that.page.update(that.option);
      };
    };
    reader.readAsDataURL(file.files[0]);
  }


  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }


  ngAfterViewInit() {
    let count = 0;
    setTimeout(() => {
      this.ngForm.valueChanges.subscribe((value) => {
        console.log('count:', count++);
        console.log(JSON.stringify(value));
        this.page.update(Object.assign({}, this.option, value));
        const changes = this._differ.diff(this.option);
        if (changes) {
          changes.forEachRemovedItem((record) => {
            console.log(JSON.stringify(record.key));
          });
          changes.forEachAddedItem((record) => {
            console.log(JSON.stringify(record.key));
          });
          changes.forEachChangedItem((record) => {
            console.log(JSON.stringify(record.key));
          });
        }
      });
    }, 50);

  }

}

