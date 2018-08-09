import {AfterViewInit, Component, EventEmitter, KeyValueDiffer, KeyValueDiffers, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {GraphicConfig} from '../graphic.config';
import {datasetManager} from '@core/dataset/dataset.manager';

@Component({
  selector: 'app-image-config',
  templateUrl: './image.config.component.html',
  styleUrls: ['./image.config.component.less']
})
export class ImageConfigComponent extends GraphicConfig implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;

  @Output() output = new EventEmitter();

  option = {
    text: '我是标题',
    dataUrl: '',
    backgroundColor: undefined
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
    const reader = new FileReader();
    reader.onload = (evt) => {
      console.log('qwerty', (<any>evt.target).result);
      this.option.dataUrl = (<any>evt.target).result;
      if (this.graphic) {
        this.graphic.update(this.option);
      }
      // console.log((<any>evt.target).result);
      // console.log(image);
      // image.src = (<any>evt.target).result;
      // image = evt.target.result;
    };
    reader.readAsDataURL(file.files[0]);
  }


  ngAfterViewInit() {
    this.ngForm.valueChanges.subscribe((value) => {
      console.log(JSON.stringify(value));
      console.log(JSON.stringify(this.option));
      const changes = this._differ.diff(value);
      if (changes) {
        console.log('has change');
        this.output.emit(value);
        //this._applyChanges(changes);
      }
    });
  }

}

