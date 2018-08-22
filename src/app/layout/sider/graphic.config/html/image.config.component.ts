import {AfterViewInit, Component, EventEmitter, KeyValueDiffer, KeyValueDiffers, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {GraphicConfig} from '../graphic.config';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-image-config',
  templateUrl: './image.config.component.html',
  styleUrls: ['./image.config.component.less']
})
export class ImageConfigComponent extends GraphicConfig implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;

  @Output() output = new EventEmitter();

  option = {
    alt: '我是标题',
    name: '',
    width: 400,
    height: 300,
    url: '',
    dataUrl: '',
    preserveAspectRatio: false
  };

  graphicOption = {
    backgroundColor: undefined,
    borderStyle: 'solid',
    borderColor: '#aaa',
    borderWidth: 0,
    borderRadius: 0
  };

  private _differ: KeyValueDiffer<any, any>;

  constructor(private _differs: KeyValueDiffers) {
    super();
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }

  change(event: Event) {
    const file: HTMLInputElement = <HTMLInputElement>event.currentTarget;
    if (!file.files || !file.files[0]) {
      return;
    }
    this.option.name = file.files[0].name;
    console.log(file.files[0]);
    const that = this;
    const reader = new FileReader();
    reader.onload = (evt) => {
      console.log('qwerty', (<any>evt.target).result);
      this.option.dataUrl = (<any>evt.target).result;
      const image = new Image();
      image.src = (<any>evt.target).result;
      image.onload = function () {
        that.option.width = (<HTMLImageElement>this).naturalWidth;
        that.option.height = (<HTMLImageElement>this).naturalHeight;
        if (that.graphic) {
          that.graphic.update(that.option);
        }
      };
    };
    reader.readAsDataURL(file.files[0]);
  }


  ngAfterViewInit() {
    this.ngForm.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      console.log('ImageConfigComponent', value);
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
      } else {
        console.log('has no changes');
      }
      if (array.length > 0) {
        console.log('do page update');
        this.graphic.updateGraphic(array);
      }
    });
  }

}

